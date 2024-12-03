import { AbstractModel } from './abstract.model';

export class LocalModel extends AbstractModel {
  constructor() {
    super();
    console.log('LocalModel is working');
  }
  async generateText(input: string): Promise<string> {
    return `Generated LocalModel text for input: ${input}`;
  }

  getTokenCost(): number {
    return 10;
  }
}
