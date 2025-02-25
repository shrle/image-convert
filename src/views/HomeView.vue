<template>
  <header>
    <h1>画像一括変換</h1>
  </header>
  <article>
    <!-- @@@@@ ファイル読み込み @@@@@  -->
    <section class="image-info">
      <div class="input-file-container">
        <input
          type="file"
          id="input-images"
          accept="image/*"
          @dragover.prevent="onDrag('over')"
          @dragleave="onDrag('leave')"
          @change="changeFile"
          multiple
        />

        <label for="input-images" :class="{ over: isDragOver }">
          画像ファイルをここに<br />ドラッグ＆ドロップしてください</label
        >
      </div>
      <section class="thum-container">
        <p :class="{ 'display-none': images }">サムネイル一覧</p>
        <template v-for="img in images" :key="img">
          <img :src="img.src" alt="" />
        </template>
      </section>
    </section>

    <!-- @@@@@ 画像設定 @@@@@ -->
    <section class="image-settings">
      <p>
        <label for="resizeTarget">リサイズの仕方</label>
        <select id="resizeTarget" v-model="resizeTarget">
          <option value="width">横幅を指定し縦横比は維持</option>
          <option value="height">高さを指定し縦横比は維持</option>
          <option value="parcent">サイズの割合を指定</option>
          <option value="size">サイズを指定</option>
          <option value="origin">サイズを変更しない</option>
        </select>
      </p>

      <p>
        <label for="resize-width">横幅</label>
        <span class="flex-row" v-if="isWidthShow">
          <input
            type="number"
            id="resize-width"
            min="0"
            v-model="resizeWidth"
          />px
        </span>

        <span v-if="isWidthHidden && isParcentHidden"
          >高さに合わせ縦横比を維持</span
        >
      </p>

      <p>
        <label for="resize-height">高さ</label>
        <span class="flex-row" v-if="isHeightShow">
          <input
            type="number"
            id="resize-height"
            min="0"
            v-model="resizeHeight"
          />px
        </span>

        <span v-if="isHeightHidden && isParcentHidden"
          >横幅に合わせ縦横比を維持</span
        >
      </p>

      <p>
        <label for="parcent">割合</label>
        <span class="flex-row" v-if="isParcentShow">
          <input
            type="range"
            id="parcent"
            min="0"
            max="100"
            step="0.1"
            v-model="parcent"
          />
          <span>{{ parcent }}</span
          >%
        </span>
      </p>

      <p>
        <label for="image-quality">画質</label>
        <input
          type="range"
          id="image-quality"
          min="0"
          max="1"
          step="0.01"
          v-model="imageQuality"
        />
        <span>{{ imageQuality }}</span>
      </p>
      <p>
        <label for="fileType">ファイル形式</label>
        <select id="fileType" v-model="fileType">
          <option value="origin">変換なし</option>
          <option value="image/png">png</option>
          <option value="image/jpeg">jpg</option>
          <option value="image/webp">webp</option>
          <option value="image/gif">gif</option>
        </select>
      </p>
      <p class="save-button-container">
        <button class="text-button primary" @click="save">変換して保存</button>
      </p>
    </section>
  </article>
  <div class="image-loading" :class="{ show: imageLoading }">画像の読込中</div>
  <div class="image-saving" :class="{ show: imageSaving }">画像の保存中</div>

  <canvas
    :width="canvasWidth"
    :height="canvasHeight"
    id="canvas"
    class="hidden"
  ></canvas>
</template>

<style>
@import "normalize.css";

:root {
  --header-hight: 40px;
  --image-setting-width: 400px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

h1 {
  font-size: 1rem;
}

header {
  width: 100%;
  height: var(--header-hight);
  position: fixed;
  top: 0;
  left: 0;
  background-color: #fff;
  z-index: 10;
}

article {
  max-width: 1280px;
  padding-top: var(--header-hight);
  padding-left: var(--image-setting-width);
  position: relative;

  display: flex;
  flex-direction: column;
}

.image-info {
  width: 100%;
  height: 100vh;

  /* background-color: #ffaaaa; */
  background-color: #ffffff;
}

.image-settings {
  width: var(--image-setting-width);
  height: 100vh;
  padding: 10px;
  /* border-right: 1px solid #cccccc; */

  display: flex;
  flex-direction: column;
  row-gap: 10px;

  position: fixed;
  top: var(--header-hight);
  left: 0;
  z-index: 10;

  /* background-color: #aaffaa; */
  background-color: #ddffff;
}
.image-settings > * {
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  column-gap: 10px;
  align-items: center;
}

.image-settings label {
  width: 30%;
}

.save-button-container {
  margin-top: 100px;
  justify-content: center;
}

.input-file-container {
  width: 100%;
  height: 40%;
  position: relative;
}

.input-file-container > input[type="file"] {
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;

  position: absolute;
  top: 0;
  left: 0;
  z-index: 11;
}

.input-file-container > label {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 50px;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: bolder;
  background-color: #cccccc;
}

.input-file-container > label.over {
  background-color: #aaaaaa;
}

.thum-container {
  width: 100%;
  height: 40%;
  padding: 10px;

  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  overflow-y: scroll;
  scrollbar-color: transparent transparent;
  scrollbar-width: thin;
}

.thum-container:hover {
  scrollbar-color: #aaaaaa #ffffff;
  scrollbar-width: thin;
}

.thum-container img {
  height: 30%;
  aspect-ratio: 1/1;

  border-radius: 15%;
  object-fit: cover;
}

.image-loading {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);

  display: flex;
  justify-content: center;
  align-items: center;

  color: #555555;
  font-size: 2rem;
  font-weight: bolder;

  position: fixed;
  top: 0;
  left: 0;

  visibility: hidden;
}
.image-loading.show {
  visibility: visible;
}

.image-saving {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);

  display: flex;
  justify-content: center;
  align-items: center;

  color: #555555;
  font-size: 2rem;
  font-weight: bolder;

  position: fixed;
  top: 0;
  left: 0;

  visibility: hidden;
}
.image-saving.show {
  visibility: visible;
}

input:read-only {
  border: 0;
  background-color: transparent;
}

.flex-row {
  display: flex;
  flex-direction: row;
  column-gap: 10px;
}

.display-none {
  display: none;
}
.hidden {
  visibility: hidden;
}

@media screen and (max-width: 700px) {
  article {
    padding-left: 0;
  }
  .image-settings {
    width: 100%;
    position: static;
  }
}
</style>

<script>
import loadImageSync from "@/js/load-image-sync";
// @ is an alias to /src

export default {
  name: "HomeView",
  components: {},
  data() {
    return {
      images: null,
      basenameList: [],
      resizeTarget: "width",
      fileType: "image/png",
      resizeWidth: 1920,
      resizeHeight: 1080,
      parcent: 100,
      imageQuality: 0.8,
      isDragOver: false,
      imageLoading: false,

      canvasWidth: 1920,
      canvasHeight: 1080,
    };
  },
  computed: {
    isWidthHidden() {
      const st = this.resizeTarget;
      return !(st === "width" || st === "size");
    },
    isWidthShow() {
      const st = this.resizeTarget;
      return st === "width" || st === "size";
    },
    isHeightHidden() {
      const st = this.resizeTarget;
      return !(st === "height" || st === "size");
    },
    isHeightShow() {
      const st = this.resizeTarget;
      return st === "height" || st === "size";
    },
    isParcentHidden() {
      const st = this.resizeTarget;
      return st !== "parcent";
    },

    isParcentShow() {
      const st = this.resizeTarget;
      return st === "parcent";
    },
  },
  watch: {
    resizeWidth(value, oldWidth) {
      if (isNaN(value)) {
        console.dir(oldWidth);
        // this.resizeWidth = oldWidth;
        return;
      }
      console.dir(oldWidth);
      this.resizeWidth = value < 0 ? 0 : value;
    },
    resizeHeight(value, oldHeight) {
      if (isNaN(value)) {
        this.resizeHeight = oldHeight;
        return;
      }
      this.resizeHeight = value < 0 ? 0 : value;
    },
    parent(value, oldParcent) {
      if (isNaN(value)) {
        this.parcent = oldParcent;
        return;
      }
      this.parcent = value < 0.1 ? 0.1 : value;
      this.parcent = value > 100 ? 100 : value;
    },
  },
  mounted() {},
  methods: {
    onDrag(state) {
      this.isDragOver = state === "over";
    },
    changeFile(event) {
      console.log("changeFile");
      const files = event.target.files;
      console.dir(files);

      if (files.length <= 0) {
        console.log("files.length === 0");
        return;
      }

      this.imageLoading = true;

      setTimeout(async () => {
        console.log("setTimeout");

        try {
          await this.loadImages(files);
        } catch (error) {
          console.dir(error);
          console.log("画像の読み込みに失敗");
        }
      }, 0);

      this.isDragOver = false;
    },

    /**
     *
     * @param {FileList} files
     */
    async loadImages(files) {
      console.log("loadImages");
      console.dir(files);
      if (!files) {
        this.imageLoading = false;
        return;
      }

      let promiseList = [];
      let urlList = [];

      // ファイルからURLを生成して、URLから画像を読み込むPromiseを生成してリスト化
      for (const file of files) {
        const url = URL.createObjectURL(file);
        promiseList.push(loadImageSync(url));

        // 生成したURLはのちに破棄するので記録しておく
        urlList.push(url);
        const basename = this.getBaseName(file.name);
        this.basenameList.push(basename);
      }

      console.dir(promiseList);

      // すべての画像の読み込みを行う
      this.images = await Promise.all(promiseList);
      console.log("this.images");
      console.dir(this.images[0].src);

      // URL.createObjectURL(file) で生成したURLを開放する
      // urlList.map((url) => {
      //   URL.revokeObjectURL(url);
      // });

      console.log("complete!");
      this.imageLoading = false;
    },

    /**
     * ファイル名から拡張子を除いた名前を取得する
     * @param {String} filename
     */
    getBaseName(filename) {
      const match = filename.match(/^(.*)\.[^.]+$/);
      if (match) {
        return match[1];
      }
      return filename; // 拡張子がない場合は元のファイル名を返す
    },

    /* @@@@@ 画像処理 @@@@@ */

    async save() {
      this.saving = true;
      const canvas = document.getElementById("canvas");

      setTimeout(async () => {
        try {
          for (let i = 0; i < this.images.length; i++) {
            const img = this.images[i];

            this.resizeCanvas(img);

            // キャンバスのサイズの変形にわずかに時間がかかるため、処理を停止させなければならない
            await this.sleep(100);
            await this.drawImage(img);
            const blob = await this.canvasToBlob(
              canvas,
              this.fileType,
              this.imageQuality
            );

            this.downloadBlob(blob, this.basenameList[i]); // 画像の保存
          }
        } catch (error) {
          console.dir(error);
          this.saving = false;
          return;
        }

        console.log("complete!");
        this.saving = false;
      }, 0);
    },

    /**
     * 画像をキャンバスのサイズに合わせてに描画する
     * @param {Image} image 描画する画像
     */
    async drawImage(image) {
      const canvas = document.getElementById("canvas");
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, this.canvasWidth, this.canvasHeight);
    },

    /**
     * 画像のリサイズ後のサイズに合わせてキャンバスのサイズを変形させる。
     * @param {Image} image リサイズ前の画像
     */
    resizeCanvas(image) {
      const resizeTarget = this.resizeTarget;

      if (resizeTarget === "size") {
        this.canvasWidth = this.resizeWidth;
        this.canvasHeight = this.resizeHeight;
        return;
      }

      if (resizeTarget === "origin") {
        this.canvasWidth = image.width;
        this.canvasHeight = image.height;
        return;
      }

      // 一時的に変数名を短縮
      const imgW = image.width;
      const imgH = image.height;
      const resizeW = this.resizeWidth;
      const resizeH = this.resizeHeight;

      // リサイズ後の倍率を求める
      let scale = 100 / this.parcent;
      scale = resizeTarget === "width" ? imgW / resizeW : scale;
      scale = resizeTarget === "height" ? imgH / resizeH : scale;

      this.canvasWidth = Math.floor(image.width / scale);
      this.canvasHeight = Math.floor(image.height / scale);
    },
    /**
     * 指定時間(ミリ秒)処理を止める
     * @param timeMs 停止させる時間(ミリ秒)
     */
    sleep(timeMs) {
      return new Promise((resolve) => setTimeout(resolve, timeMs));
    },

    /**
     * キャンバスのBlobを取得する
     * @param {HTMLCanvasElement} canvas Blob化する対象のキャンバス
     * @param {String} imageType mimeType
     * @param {Number} quality 画像の品質 (0 - 1 の値)
     *
     * @returns {Promise<Blob>}
     */
    canvasToBlob(canvas, imageType, quality) {
      return new Promise((resolve) => {
        canvas.toBlob(
          function (blob) {
            resolve(blob);
          },
          imageType,
          quality
        );
      });
    },

    /**
     * Blobをローカルに保存する
     * @param {Blob} blob
     * @param {String} fileName
     */
    downloadBlob(blob, fileName) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName; // ダウンロード時のファイル名
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url); // メモリリークを防ぐためにURLを解放
    },
  },
};
</script>
