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


  async connect(): Promise<boolean> {
    try {
      // Disconnect current connection first
      if (this.isConnected) await this.disconnect();
      
      // Close all previously granted ports
      const ports = await navigator.serial.getPorts();
      for (const port of ports) {
        try {
          await port.close();
        } catch {}
      }
      
      // Request port access - shows port selection dialog
      this.port = await navigator.serial.requestPort();
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
    } catch (error: any) {
      if (error.message?.includes('already open')) {
        // Port is already open, try to close all ports and retry
        const ports = await navigator.serial.getPorts();
        for (const port of ports) {
          try { await port.close(); } catch {}
        }
        await new Promise(r => setTimeout(r, 300));
        return this.connect();
      }
      console.error('Failed to connect to STM32F446RE:', error);
      this.onErrorCallback?.(`Connection failed: ${error}`);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    try {
      this.isConnected = false;
      if (this.reader) {
        try { await this.reader.cancel(); } catch {}
        this.reader = null;
      }
      if (this.writer) {
        try { await this.writer.close(); } catch {}
        this.writer = null;
      }
      if (this.port) {
        try { await this.port.close(); } catch {}
        this.port = null;
      }
      console.log('STM32F446RE disconnected');
    } catch (error) {
      console.error('Error disconnecting STM32F446RE:', error);
    }
  }

  private async startReading(): Promise<void> {
    if (!this.port) return;

    try {
      const textDecoder = new TextDecoderStream();
      this.port.readable?.pipeTo(textDecoder.writable as WritableStream<Uint8Array>);
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
      const lines = data.split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        try {
          const response: STM32Response = JSON.parse(line);
          this.onDataCallback?.(response);
        } catch {
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
      textEncoder.readable?.pipeTo(this.port.writable!);
      this.writer = textEncoder.writable?.getWriter();
      if (!this.writer) return false;

      let message: string;
      // For CIRCUIT_STRUCTURE, send the raw structure string
      if (command === 'CIRCUIT_STRUCTURE' && parameters?.structure) {
        message = parameters.structure + '\n';
        console.log('Sending raw structure to STM32F446RE:', message);
      } else {
        // For other commands, send as JSON
        const commandData: STM32Command = {
          command,
          parameters,
          timestamp: Date.now()
        };
        message = JSON.stringify(commandData) + '\n';
        console.log('Sending JSON to STM32F446RE:', message);
      }

      await this.writer.write(`${message}X`);
      await this.writer.close();
      console.log('Sent to STM32F446RE:', message);
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

  async sendCircuitStructure(structure: string): Promise<boolean> {
    if (!this.isConnected || !this.port) {
      console.error('STM32F446RE not connected');
      return false;
    }
    try {
      const textEncoder = new TextEncoderStream();
      textEncoder.readable?.pipeTo(this.port.writable!);
      this.writer = textEncoder.writable?.getWriter();
      if (!this.writer) return false;
      // const message = structure.padEnd(14, "!");
      const message = structure.padEnd(8, "n");
      console.log('Sending raw circuit structure to STM32F446RE:', message);
      // await this.writer.write(message);
      await this.writer.write(message);
      await this.writer.close();
      console.log('Sent to STM32F446RE:', message);
      return true;
    } catch (error) {
      console.error('Error sending circuit structure to STM32F446RE:', error);
      this.onErrorCallback?.(`Send failed: ${error}`);
      return false;
    }
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

}