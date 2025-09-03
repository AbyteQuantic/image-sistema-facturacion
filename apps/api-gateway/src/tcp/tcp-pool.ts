export class TcpPool {
  private i = 0;
  constructor(private readonly targets: { host: string; port: number }[]) {}
  next() { const t = this.targets[this.i]; this.i = (this.i + 1) % this.targets.length; return t; }
}
