export interface Signer {
  sign: (value: string) => string
  unsign: (value: string) => string
}
