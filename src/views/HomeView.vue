<template>
  <header>
    <div class="left-container">
      <h1><img src="@/assets/logo.svg" alt="ロゴ" />画像一括変換</h1>
    </div>

    <div class="right-container">
      <button class="icon-button silent" @click="isAboutRead = false">
        <span class="material-symbols-outlined"> help </span>
      </button>
    </div>
  </header>
  <article @dragover.prevent="dragover()">
    <!-- @@@@@ ファイル読み込み @@@@@  -->
    <section class="image-info">
      <section class="input-container">
        <input
          type="file"
          id="input-images"
          accept="image/*"
          @change="changeFile"
          :class="{ hidden: !isDragOver }"
          @dragover.prevent="dragover()"
          @dragleave="dragleave()"
          multiple
        />
        <label
          for="input-images"
          class="pc"
          :class="{ over: isDragOver }"
          @dragover.prevent="dragover()"
        >
          <p class="">画像ファイルをこの画面に<br />ドロップしてください</p>
        </label>
        <label for="input-images" class="mobile"> + 画像の追加</label>
      </section>

      <section class="thum-container" @dragover.prevent="dragover()">
        <template v-for="img in images" :key="img">
          <img :src="img.src" alt="サムネイル" />
        </template>
      </section>
    </section>

    <!-- @@@@@ 画像設定 @@@@@ -->
    <section class="image-settings" @dragover.prevent="dragover()">
      <p>
        <label for="resizeTarget"
          ><span class="material-symbols-outlined"> resize </span
          >リサイズの仕方</label
        >
        <select id="resizeTarget" v-model="resizeTarget">
          <option value="width">横幅を指定し縦横比は維持</option>
          <option value="height">高さを指定し縦横比は維持</option>
          <option value="percent">サイズの割合を指定</option>
          <option value="size">サイズを指定</option>
          <option value="origin">サイズを変更しない</option>
        </select>
      </p>

      <p>
        <label for="resize-width">
          <span class="material-symbols-outlined"> fit_page_width </span>
          横幅</label
        >
        <span class="flex-row" v-if="isWidthShow">
          <input
            type="number"
            id="resize-width"
            min="0"
            v-model="resizeWidth"
          />px
        </span>

        <span v-if="isWidthHidden && isParcentHidden"
          ><span class="material-symbols-outlined"> join </span
          >高さに合わせ縦横比を維持</span
        >
      </p>

      <p>
        <label for="resize-height"
          ><span class="material-symbols-outlined"> fit_page_height </span
          >高さ</label
        >
        <span class="flex-row" v-if="isHeightShow">
          <input
            type="number"
            id="resize-height"
            min="0"
            v-model="resizeHeight"
          />px
        </span>

        <span v-if="isHeightHidden && isParcentHidden"
          ><span class="material-symbols-outlined"> join </span
          >横幅に合わせ縦横比を維持</span
        >
      </p>

      <p>
        <label for="percent"
          ><span class="material-symbols-outlined"> zoom_out </span>割合</label
        >
        <span class="flex-row" v-if="isParcentShow">
          <input
            type="range"
            id="percent"
            min="0"
            max="100"
            step="0.1"
            v-model="percent"
          />
          <span>{{ percent }}</span
          >%
        </span>
      </p>

      <p>
        <label for="image-quality"
          ><span class="material-symbols-outlined"> high_quality </span
          >画質</label
        >
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
        <label for="fileType"
          ><span class="material-symbols-outlined"> image </span
          >ファイル形式</label
        >
        <select id="fileType" v-model="fileType">
          <option value="origin">変換なし</option>
          <option value="image/png">png</option>
          <option value="image/jpeg">jpg</option>
          <option value="image/webp">webp</option>
        </select>
      </p>
      <p class="save-button-container">
        <button class="text-button primary" @click="save">変換して保存</button>
      </p>
    </section>
  </article>
  <div class="dragover" :class="{ visible: isDragOver }">
    画像をドロップしてください
  </div>
  <div class="image-loading" :class="{ show: imageLoading }">画像の読込中</div>
  <div class="image-saving" :class="{ show: saving }">画像の保存中</div>

  <section class="about" :class="{ hide: isAboutRead }">
    <h2>機能</h2>
    <ul>
      <li>画像を一括でリサイズできます。</li>
      <li>画像のファイル形式を一括で変換できます。(jpg/ png/ webp)</li>
      <li>
        すべての処理はお使いの端末上で行われます。画像のアップロードは行いません。
      </li>
    </ul>
    <h2>使い方</h2>
    <ol>
      <li>
        <span class="pc"
          >まずこの画面に画像ファイルをドラッグ＆ドロップしてください。</span
        >
        <span class="mobile"
          >まず「画像の追加」ボタンから画像を選択してください。</span
        >
      </li>

      <li>
        <span class="pc">左の項目を設定する</span>
        <span class="mobile">下の項目を設定する</span>
      </li>

      <li>「変換して保存」ボタンを押す</li>
    </ol>
    <button class="text-button ok" @click="isAboutRead = true">
      分かった！
    </button>
  </section>

  <canvas
    :width="canvasWidth"
    :height="canvasHeight"
    id="canvas"
    class="hidden"
  ></canvas>
</template>

<style>
@import "normalize.css";

/* TODO: ドラッグを禁止する */

:root {
  --header-hight: 40px;
  --image-setting-width: 400px;

  --body-background-color: #eee4e1;
  --header-background-color: #ffffff;
  --side-background-color: #adc77a;
  --file-input-background-color: #a08c7b;
  --file-input-color: #000000;
  --thum-background-color: #eee4e1;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--body-background-color);
  user-select: none;
  -webkit-user-drag: none;
  -moz-user-select: none;
}

img {
  user-select: none;
  -webkit-user-drag: none;
  -moz-user-select: none;
}

header {
  width: 100%;
  height: var(--header-hight);
  position: fixed;
  top: 0;
  left: 0;
  background-color: var(--header-background-color);
  z-index: 10;

  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: 1fr;
}

header > * {
  width: 100%;
  height: var(--header-hight);
  display: flex;
  align-items: center;
}

.right-container {
  display: flex;
  flex-direction: row;
  justify-content: end;

  padding-right: 100px;
}

h1 {
  height: 80%;
  font-size: 1rem;
  margin: 0;
  margin-left: 30px;
  display: flex;
  align-items: center;
}

h1 img {
  width: auto;
  height: 100%;
  margin-right: 10px;
}

.about {
  width: 90%;
  height: 60%;
  max-width: 1000px;
  padding: 50px;

  background-color: #fff;
  border-radius: 15px;

  position: fixed;
  z-index: 101;
  top: 50%;
  left: 50%;
  right: auto;
  transform: translate(-50%, -50%);

  /* top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); */
  transition: all ease-in-out 0.3s;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 20px;
}

.about.hide {
  width: 30px;
  height: 30px;
  padding: 0;

  z-index: -1;
  top: 0;
  right: 100px;
  left: auto;
  transform: translate(0, 0);
}

.about.hide * {
  display: none;
}

.about h2 {
}

.about ul,
.about ol {
  padding-left: 30px;
}

.about li {
  margin-bottom: 10px;
}

.about .mobile {
  display: none;
}

article {
  width: 100%;
  min-height: calc(100vh - var(--header-hight));
  height: 100%;
  padding-top: var(--header-hight);
  padding-left: var(--image-setting-width);
  position: relative;

  display: flex;
  justify-content: center;
}

/* @@@@@ サイドバーの設定 @@@@@ */

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
  background-color: var(--side-background-color);
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
  width: 40%;
  display: flex;
  align-items: center;
}

.image-settings label + * {
  display: flex;
  align-items: center;
}

.image-settings label span {
  margin-right: 10px;
}

.save-button-container {
  margin-top: 100px;
  justify-content: center;
}

/* @@@@@ 画像DDとサムネの設定 @@@@@ */

.image-info {
  max-width: 800px;
  width: 100%;
  height: 100%;

  background-color: var(--thum-background-color);

  position: relative;
}

/* .input-file-container {
  width: 100%;
  height: 40%;
  position: relative;
} */

.input-container {
  width: 100%;
  height: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.input-container > input[type="file"] {
  width: 100vw;
  height: 100vh;
  opacity: 0;
  cursor: pointer;

  position: fixed;
  top: 0;
  left: 0;
  z-index: 1001;
}

.input-container > label {
  width: 400px;
  height: 100px;
  margin: 0;
  padding: 50px;

  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;

  font-size: 1.5rem;
  font-weight: bolder;
  border-radius: 15px;
  background-color: var(--file-input-background-color);
  color: var(--file-input-color);

  position: fixed;
  left: 50%;
  bottom: 50px;
  transform: translateX(-50% + var(--image-setting-width));
}

.input-container > label.mobile {
  display: none;

  font-size: 1rem;
  font-weight: bolder;
  height: 40px;
  min-width: 100px;
  width: fit-content;

  padding: 0;
  justify-content: center;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 20px;
  border: transparent 2px solid;
}

.input-container > label.mobile:hover {
  background-color: #cccccc;
}
.input-container > label.mobile:active {
  background-color: #aaaaaa;
}
.input-container > label.mobile:focus {
  background-color: #ffffff;
  border: #000000 2px solid;
  color: #000000;
}

.dragover {
  width: 100%;
  height: 100%;
  background-color: #ffffff80;
  font-size: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;

  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;

  visibility: hidden;
}

.thum-container {
  width: 100%;
  height: 100%;
  padding: 10px;
  background-color: var(--thum-background-color);

  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-content: start;
  gap: 10px;

  overflow-y: scroll;
  scrollbar-color: transparent transparent;
  scrollbar-width: thin;
}

.thum-container img {
  width: 100%;
  aspect-ratio: 1/1;

  border-radius: 15%;
  object-fit: cover;
}

.image-loading {
  width: 100%;
  height: 100%;
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
  z-index: 102;

  visibility: hidden;
}
.image-loading.show {
  visibility: visible;
}

.image-saving {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);

  display: flex;
  justify-content: center;
  align-items: center;

  color: #ffffff;
  font-size: 3rem;
  font-weight: bolder;

  position: fixed;
  top: 0;
  left: 0;
  z-index: 102;

  visibility: hidden;
}
.image-saving.show {
  visibility: visible;
}

input:read-only {
  border: 0;
  background-color: transparent;
}

canvas {
  position: fixed;
  z-index: 1;
  display: none;
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
.visible {
  visibility: visible;
}

@media screen and (max-width: 800px) {
  .about .pc {
    display: none;
  }

  .about .mobile {
    display: inline;
  }

  article {
    padding-left: 0;
    display: flex;
    flex-direction: column;
  }
  .image-info {
    max-height: 30%;
    height: 30%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .input-container {
    height: 100px;
  }

  .input-container label {
    width: 90%;
    position: static;
  }
  .image-settings {
    width: 100%;
    position: static;
  }

  .input-container > label.pc {
    display: none;
  }

  .input-container > label.mobile {
    display: flex;
  }

  .thum-container {
    max-height: calc(100% - 60px);

    overflow-y: auto;
    scrollbar-color: #aaaaaa #ffffff;
    scrollbar-width: thin;
  }
}
</style>

<script lang="ts">
import loadImageAsync from "@/ts/load-image-sync";
import { defineComponent } from "vue";

// @ is an alias to /src

interface ComponentData {
  /** 説明を読んだか？ true = 説明を非表示 , false = 説明を表示 */
  isAboutRead: boolean;
  /** ユーザーが指定した画像のリスト */
  images: Array<HTMLImageElement>;
  /** 拡張子を含まないファイル名のリスト */
  basenameList: Array<string>;
  /**
   * 指定された値によってリサイズ後のサイズを決める
   * "width": 横幅を指定し縦横比は維持
   * "height": 高さを指定し縦横比は維持
   * "percent": サイズの割合を指定
   * "size": 横幅と高さを指定する
   * "origin": サイズを変更しない
   */
  resizeTarget: "width" | "height" | "percent" | "size" | "origin";
  /** 変更可能なファイル形式、ブラウザに依存する、現状chromeではこの3種類に対応する */
  fileType: "image/png" | "image/jpeg" | "image/webp";
  /** ユーザーが入力したリサイズ後の横幅 */
  resizeWidth: number;
  /** ユーザーが入力したリサイズ後の高さ */
  resizeHeight: number;
  /** ユーザーが入力したオリジナルのサイズに対する割合 */
  percent: number;
  /** ユーザーが入力した画質の指定 0.0 - 1.0 */
  imageQuality: number;
  /** true = ドラッグオーバー中 */
  isDragOver: boolean;
  /** true = 画像読込中 */
  imageLoading: boolean;
  /** true = 画像保存中 */
  saving: boolean;

  /** キャンバスの横幅 */
  canvasWidth: number;
  /** キャンバスの高さ */
  canvasHeight: number;
}

export default defineComponent({
  name: "HomeView",
  components: {},
  data(): ComponentData {
    return {
      isAboutRead: false,
      images: [],
      basenameList: [],
      resizeTarget: "width",
      fileType: "image/png",
      resizeWidth: 1920,
      resizeHeight: 1080,
      percent: 100,
      imageQuality: 0.8,
      isDragOver: false,
      imageLoading: false,
      saving: false,

      canvasWidth: 1920,
      canvasHeight: 1080,
    };
  },
  computed: {
    /**
     * 横幅の入力欄を隠している場合
     *
     * @returns {boolean} true = 横幅の入力欄を隠している
     */
    isWidthHidden() {
      const st: string = this.resizeTarget;
      return !(st === "width" || st === "size");
    },

    /**
     * 横幅の入力欄を表示している場合
     *
     * @returns {boolean} true = 横幅の入力欄を表示している
     */
    isWidthShow() {
      const st: string = this.resizeTarget;
      return st === "width" || st === "size";
    },

    /**
     * 高さの入力欄を隠している
     *
     * @returns {boolean} true = 高さの入力欄を隠している
     */
    isHeightHidden() {
      const st: string = this.resizeTarget;
      return !(st === "height" || st === "size");
    },

    /**
     * 高さの入力欄を表示している
     *
     * @returns {boolean} true = 高さの入力欄を表示している
     */
    isHeightShow() {
      const st: string = this.resizeTarget;
      return st === "height" || st === "size";
    },

    /**
     * 割合の入力欄を隠している
     *
     * @returns {boolean} true = 割合の入力欄を隠している
     */
    isParcentHidden() {
      const st: string = this.resizeTarget;
      return st !== "percent";
    },

    /**
     * 割合の入力欄を表示している
     *
     * @returns {boolean} true = 割合の入力欄を表示している
     */
    isParcentShow() {
      const st: string = this.resizeTarget;
      return st === "percent";
    },
  },
  watch: {
    /**
     * 横幅の入力値が0より下げない
     * 備考: HTMLのmin属性で制御しているから必要ないかもしれない
     * @param value
     */
    resizeWidth(value) {
      this.resizeWidth = value < 0 ? 0 : value;
    },

    /**
     * 高さの入力値が0より下げない
     * 備考: HTMLのmin属性で制御しているから必要ないかもしれない
     * @param value
     */
    resizeHeight(value) {
      this.resizeHeight = value < 0 ? 0 : value;
    },

    /**
     * 割合の入力値が0 - 100の範囲に留める
     * 備考: HTMLで制御しているから必要ないかもしれない
     * @param value
     */
    parent(value) {
      this.percent = value < 0.1 ? 0.1 : value;
      this.percent = value > 100 ? 100 : value;
    },
  },
  mounted() {},
  methods: {
    /**
     * ドラッグオーバーのフラグを立てる
     */
    dragover(): void {
      this.isDragOver = true;
    },

    /**
     * ドラッグオーバーのフラグを解除する
     */
    dragleave(): void {
      this.isDragOver = false;
    },

    /**
     * input[type=file]が変更された時(ファイルをD&Dかファイル指定されたとき)呼び出される関数
     * 指定された画像を読み込む
     *
     * @param event {Event}
     */
    changeFile(event: Event): void {
      // 何らかの理由でファイルの指定がなかった
      if (!event.target) return;

      // 指定されたファイルのリスト
      const files = (event.target as HTMLInputElement).files;

      if (!files || files.length <= 0) {
        // 何らかの理由でファイル指定が見つからなかった
        return;
      }

      // 画像を読込中のフラグを立てる
      this.imageLoading = true;

      // 非同期的に画像読み込みを行わせる
      setTimeout(async () => {
        // 画像を読み込む
        await this.loadImages(files);
      }, 0);

      // ドラッグオーバーのフラグを解除する
      this.isDragOver = false;
    },

    /**
     * 同期的にファイルリストから画像の読み込みを行う
     * @param files input[type=file]から指定された(event.target as HTMLInputElement).filesのファイルリスト
     */
    async loadImages(files: FileList) {
      if (!files || files.length === 0) {
        // ファイル指定が見つからなかった
        this.imageLoading = false;
        return;
      }

      /** 同期的に画像を読み込むための関数のリスト */
      let promiseList: Promise<HTMLImageElement>[] = [];
      /**
       * URL.createObjectURL(file)で生成したURLのリスト
       * 破棄するときに必要となる
       */
      let urlList: string[] = [];

      // ファイルからURLを生成して、URLから画像を読み込むPromiseを生成してリスト化
      for (const file of files) {
        // 画像ファイルを読み込むためのURLを生成する
        const url = URL.createObjectURL(file);
        // 画像ファイルを読み込むPromiseをリストに追加
        promiseList.push(loadImageAsync(url));

        // 生成したURLはのちに破棄するので記録しておく
        urlList.push(url);
        // 拡張子を除いたファイル名を取得 / file.name = パスを除いたファイル名
        const basename = this.getBaseName(file.name);
        // ファイル名をリストに追加
        this.basenameList.push(basename);
      }

      // すべての画像の読み込みを行う
      const result = await Promise.allSettled(promiseList);

      if (!Array.isArray(this.images)) {
        // 画像のリストがない場合に初期化する
        this.images = [];
      }

      // 読み込んだ画像の状態を調べる
      for (const r of result) {
        // 読み込みに失敗している場合
        if (r.status === "rejected") continue;
        // 読み込みに成功したらリストに追加
        this.images.push(r.value);
      }

      // 画像の読込中のフラグを解除する
      this.imageLoading = false;
    },

    /**
     * ファイル名から拡張子を除いた名前を取得する
     * @param {string} filename
     *
     * @returns 拡張子を除いたファイル名
     */
    getBaseName(filename: string): string {
      const match = filename.match(/^(.*)\.[^.]+$/);
      if (match) {
        return match[1];
      }
      return filename; // 拡張子がない場合は元のファイル名を返す
    },

    /* @@@@@ 画像処理 @@@@@ */

    /**
     * 同期的に画像ファイルをクライアントに保存する
     */
    async save() {
      // 保存中のフラグを立てる
      this.saving = true;
      // キャンバス要素を取得
      const canvas = document.getElementById("canvas") as HTMLCanvasElement;

      // 非同期的に処理を行う
      setTimeout(async () => {
        try {
          for (let i = 0; i < this.images.length; i++) {
            const img = this.images[i];

            // キャンバスをリサイズ後のサイズに変形させる
            this.resizeCanvas(img, this.resizeTarget);

            // キャンバスのサイズの変形にわずかに時間がかかるため、処理を停止させなければならない
            await this.sleep(100);
            // キャンバスに画像を描画する
            await this.drawImage(img);
            // キャンバスからblobを取得する
            const blob = await this.canvasToBlob(
              canvas,
              this.fileType,
              this.imageQuality
            );

            // blobを画像ファイルとしてクライアントに保存する
            this.downloadBlob(blob, this.basenameList[i]);
          }
        } catch (error) {
          console.dir(error);
          this.saving = false;
          return;
        }

        this.saving = false;
      }, 0);
    },

    /**
     * 画像をキャンバスのサイズに合わせてに描画する
     * @param {HTMLImageElement} image 描画する画像
     */
    async drawImage(image: HTMLImageElement) {
      // キャンバス要素を取得する
      const canvas = document.getElementById("canvas") as HTMLCanvasElement;
      // 描画に必要なコンテキストを取得
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      // 画像を描画する
      ctx.drawImage(image, 0, 0, this.canvasWidth, this.canvasHeight);
    },

    /**
     * 指定のリサイズの方法を元に指定画像のリサイズ後のサイズを計算し、キャンバスをそのサイズに変形させる
     * @param image リサイズ前の画像
     * @param resizeTarget 指定された値によってリサイズ後のサイズを決める
     * "width": 横幅を指定し縦横比は維持
     * "height": 高さを指定し縦横比は維持
     * "percent": サイズの割合を指定
     * "size": 横幅と高さを指定する
     * "origin": サイズを変更しない
     */
    resizeCanvas(
      image: HTMLImageElement,
      resizeTarget: "width" | "height" | "percent" | "size" | "origin"
    ) {
      // 横幅と高さを指定する場合
      if (resizeTarget === "size") {
        this.canvasWidth = this.resizeWidth;
        this.canvasHeight = this.resizeHeight;
        return;
      }

      // サイズを変更しない場合
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
      // "percent"の場合は入力された割合から求める
      let scale = 100 / this.percent;
      // 元の横幅 / リサイズ後の横幅 = リサイズ後の倍率
      scale = resizeTarget === "width" ? imgW / resizeW : scale;
      // 元の高さ / リサイズ後の高さ = リサイズ後の倍率
      scale = resizeTarget === "height" ? imgH / resizeH : scale;

      // リサイズ後のサイズをキャンバスに適用する
      this.canvasWidth = Math.floor(image.width / scale);
      this.canvasHeight = Math.floor(image.height / scale);
    },
    /**
     * 指定時間(ミリ秒)処理を止める
     * @param {number} timeMs 停止させる時間(ミリ秒)
     */
    sleep(timeMs: number) {
      return new Promise((resolve) => setTimeout(resolve, timeMs));
    },

    /**
     * 同期的にキャンバスのBlobを取得する
     * @param {HTMLCanvasElement} canvas Blob化する対象のキャンバス
     * @param {string} imageType mimeType
     * @param {number} quality 画像の品質 (0.0 - 1.0 の値)
     *
     * @returns {Promise<Blob>}
     */
    canvasToBlob(
      canvas: HTMLCanvasElement,
      imageType: string,
      quality: number
    ): Promise<Blob> {
      return new Promise((resolve) => {
        canvas.toBlob(
          function (blob) {
            if (!blob) {
              Promise.reject(new Error());
              return;
            }
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
     * @param {string} fileName
     */
    downloadBlob(blob: Blob, fileName: string) {
      // blobからURLを取得
      const url = URL.createObjectURL(blob);
      // a要素(リンク)を生成
      const a = document.createElement("a");
      // リンクにURLを設定
      a.href = url;
      // ダウンロード時のファイル名を設定
      a.download = fileName;
      // a要素をDOMに追加
      document.body.appendChild(a);
      // リンクをクリックさせることでダウンロードが行われる
      a.click();
      // a要素はもう不要なので消去
      document.body.removeChild(a);
      // メモリリークを防ぐためにURLを解放
      URL.revokeObjectURL(url);
    },
  },
});
</script>
