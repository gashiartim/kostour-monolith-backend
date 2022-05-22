export interface FileI extends Express.Multer.File {
  id: string;
  ext: string;
  name: string;
  fieldname: string;
  originalname: string;
  filename: string;
  encoding: string;
  mimetype: string;
  destination: string;
  size: number;
  width: number;
  height: number;
  path: string;
  url: string;
}
