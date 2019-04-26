interface TodolistOption {
  id: string;
  title: string;
  bucketID: string
  bucket: string;
}

interface TodolistOptionGroup {
  bucketID: string;
  bucket: string;
  options: TodolistOption[];
}
