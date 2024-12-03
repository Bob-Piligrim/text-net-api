export interface NeuralNetworkModel {
  generateText(input: string): Promise<string>;
}
