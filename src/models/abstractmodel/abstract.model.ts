import { NeuralNetworkModel } from './model.interface';

export abstract class AbstractModel implements NeuralNetworkModel {
  abstract generateText(input: string): Promise<string>;
}
