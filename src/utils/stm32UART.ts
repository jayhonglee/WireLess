// Web Serial API type declarations
declare global {
  interface Navigator {
    serial: {
      requestPort(): Promise<SerialPort>;
      getPorts(): Promise<SerialPort[]>;
    };
  }

  interface SerialPort {
    open(options: SerialOptions): Promise<void>;
    close(): Promise<void>;
    readable: ReadableStream<Uint8Array> | null;
    writable: WritableStream<Uint8Array> | null;
  }

  interface SerialOptions {
    baudRate: number;
    dataBits?: number;
    parity?: 'none' | 'even' | 'odd';
    stopBits?: number;
    bufferSize?: number;
    flowControl?: 'none' | 'hardware';
  }
}

// src/utils/stm32UART.ts
export interface STM32Config {
  baudRate: 9600 | 19200 | 38400 | 57600 | 115200;
  dataBits: 8;
  parity: 'none';
  stopBits: 1;
  flowControl: 'none';
}

export interface STM32Command {
  command: string;
  parameters?: any;
  timestamp: number;
}

export interface STM32Response {
  status: 'success' | 'error' | 'data';
  data?: any;
  message?: string;
  timestamp: number;
}

export class STM32UARTConnection {
  private port: SerialPort | null = null;
  private reader: ReadableStreamDefaultReader | null = null;
  private writer: WritableStreamDefaultWriter | null = null;
  private isConnected: boolean = false;
  private config: STM32Config;
  private onDataCallback?: (data: STM32Response) => void;
  private onErrorCallback?: (error: string) => void;

  constructor(config: STM32Config = {
    baudRate: 115200,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: 'none'
  }) {
    this.config = config;
  }

  async getAvailablePorts(): Promise<SerialPort[]> {
    try {
      return await navigator.serial.getPorts();
    } catch (error) {
      console.error('Error getting available ports:', error);
      return [];
    }
  }

  async connect(): Promise<boolean> {
    try {
      // Request port access - this will show a port selection dialog
      this.port = await navigator.serial.requestPort();
      
      // Open the port with STM32 configuration
      await this.port.open({
        baudRate: this.config.baudRate,
        dataBits: this.config.dataBits,
        parity: this.config.parity,
        stopBits: this.config.stopBits,
        bufferSize: 1024,
        flowControl: this.config.flowControl
      });

      this.isConnected = true;
      this.startReading();
      console.log('STM32F446RE connected successfully');
      return true;
    } catch (error) {
      console.error('Failed to connect to STM32F446RE:', error);
      this.onErrorCallback?.(`Connection failed: ${error}`);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    try {
      this.isConnected = false;
      await this.reader?.cancel();
      await this.writer?.close();
      await this.port?.close();
      this.port = null;
      this.reader = null;
      this.writer = null;
      console.log('STM32F446RE disconnected');
    } catch (error) {
      console.error('Error disconnecting STM32F446RE:', error);
    }
  }

  private async startReading(): Promise<void> {
    if (!this.port) return;

    try {
      const textDecoder = new TextDecoderStream();
      const readableStreamClosed = this.port.readable?.pipeTo(textDecoder.writable);
      this.reader = textDecoder.readable?.getReader();

      if (!this.reader) return;

      while (this.isConnected) {
        try {
          const { value, done } = await this.reader.read();
          if (done) break;
          
          if (value) {
            this.handleIncomingData(value);
          }
        } catch (error) {
          console.error('Error reading from STM32F446RE:', error);
          break;
        }
      }
    } catch (error) {
      console.error('Error starting STM32F446RE reader:', error);
    }
  }

  private handleIncomingData(data: string): void {
    try {
      // Parse STM32 response
      const lines = data.split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        try {
          const response: STM32Response = JSON.parse(line);
          this.onDataCallback?.(response);
        } catch {
          // If not JSON, treat as plain text response
          const response: STM32Response = {
            status: 'data',
            data: line.trim(),
            timestamp: Date.now()
          };
          this.onDataCallback?.(response);
        }
      }
    } catch (error) {
      console.error('Error parsing STM32F446RE data:', error);
    }
  }

  async sendCommand(command: string, parameters?: any): Promise<boolean> {
    if (!this.isConnected || !this.port) {
      console.error('STM32F446RE not connected');
      return false;
    }

    try {
      const textEncoder = new TextEncoderStream();
      const writableStreamClosed = textEncoder.readable?.pipeTo(this.port.writable!);
      this.writer = textEncoder.writable?.getWriter();

      if (!this.writer) return false;

      const commandData: STM32Command = {
        command,
        parameters,
        timestamp: Date.now()
      };

      const message = JSON.stringify(commandData) + '\n';
      await this.writer.write(message);
      await this.writer.close();
      
      console.log('Sent to STM32F446RE:', commandData);
      return true;
    } catch (error) {
      console.error('Error sending command to STM32F446RE:', error);
      this.onErrorCallback?.(`Send failed: ${error}`);
      return false;
    }
  }

  // Circuit-specific commands for WireLess
  async sendCircuitData(circuitData: any): Promise<boolean> {
    return this.sendCommand('CIRCUIT_DATA', circuitData);
  }

  async generateCircuit(components: any[]): Promise<boolean> {
    return this.sendCommand('GENERATE_CIRCUIT', { components });
  }

  async setPowerSource(powerSource: any): Promise<boolean> {
    return this.sendCommand('SET_POWER_SOURCE', powerSource);
  }

  async getSystemStatus(): Promise<boolean> {
    return this.sendCommand('GET_SYSTEM_STATUS');
  }

  async resetSystem(): Promise<boolean> {
    return this.sendCommand('RESET_SYSTEM');
  }

  onData(callback: (data: STM32Response) => void): void {
    this.onDataCallback = callback;
  }

  onError(callback: (error: string) => void): void {
    this.onErrorCallback = callback;
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  getConfig(): STM32Config {
    return { ...this.config };
  }

  getCurrentPort(): SerialPort | null {
    return this.port;
  }
}