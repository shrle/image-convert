/**
 * createObjectURLから受け取った画像ファイルを同期的に読み込む
 * @param {string} src input[type=file]からFileListを取得し、createObjectURL(File)からの戻り値を引数とする
 * @returns {Promise<HTMLImageElement>} 成功時にはImageを返す、失敗時にはエラーを返す(主にパスの指定ミスなどで失敗する)
 */
const loadImageSync = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    // 画像ファイルを扱うためのクラスを作成
    const img = new Image();
    // 画像ファイルの読み込んだら画像ファイルを返す
    img.onload = () => resolve(img);

    img.onerror = (e) => {
      // エラーログ出力
      console.dir(e);
      // 画像の読み込みに失敗したらエラーを返す
      return reject(e);
    };
    // 画像ファイルを読み込む
    img.src = src;
  });
};

console.log("loadImageSync");
export default loadImageSync;
