/**
 * 主にクライアントからの画像ファイルを同期的に読み込む
 * @param {createObjectURL()} src input[type=file]からFileListを取得し、createObjectURL(File)からの戻り値を引数とする
 * @returns {Promise<Image>} 成功時にはImageを返す
 */
const loadImageSync = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => {
      console.dir(e);
      return reject(e);
    };
    img.src = src;
  });
};

export default loadImageSync;
