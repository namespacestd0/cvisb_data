import { Citation } from './citation';

export class ViralSeqObj {
  publisher: Object;
  publication: Citation[];
  cvisb_data: boolean;
  data: ViralSeqData;
}

export class ViralSeqData {
  virus: string;
  quality: number;
  DNAsequence: string;
}