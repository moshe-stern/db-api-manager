interface IClientResponseRecord {
  id: number;
  phoneNumber: string;
  responseType: string;
  body: string;
  responseDate: Date;
}

interface IProvider {
  id: string
  email: string
  subRegion: string
}

export {
  IProvider,
  IClientResponseRecord
}