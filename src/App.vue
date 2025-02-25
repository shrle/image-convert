<template>
  <router-view />
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Kosugi+Maru&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap");

* {
  box-sizing: border-box;
  margin: 0px;
  padding: 0px;
  -webkit-user-select: none; /* Safari */
  user-select: none;
  font-family: "Roboto", sans-serif;
}

button.icon-button {
  width: 40px;
  height: 40px;
  border: 0;
  background-color: #eeeeee;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

button.icon-button.primary {
  background-color: #aaaaaa;
}

button.icon-button.silent {
  background-color: transparent;
}

button.icon-button:hover {
  background-color: #cccccc;
}

button.icon-button:active {
  background-color: #aaaaaa;
}

button.text-button {
  background-color: #eeeeee;
  color: #000000;
  font-weight: bolder;
  min-width: 100px;
  width: fit-content;

  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  padding: 0 20px;
  border-radius: 26px;
  border: transparent 2px solid;
}

button.text-button.primary {
  background-color: #000000;
  color: #ffffff;
}

button.text-button.silent {
  background-color: transparent;
  color: #000000;
  border: #cccccc 1px solid;
}

button.text-button:hover {
  background-color: #cccccc;
}

button.text-button:active {
  background-color: #aaaaaa;
}

button.text-button:focus {
  background-color: #ffffff;
  border: #000000 2px solid;
  color: #000000;
}

select {
  flex: auto;
  max-width: 200px;
  width: 100%;
  border: 0;
  border-bottom: #000000 2px solid;
  background-color: transparent;
}

input[type="number"] {
  width: 50px;
  /* height: 40px; */
  border: 0;
  border-bottom: #000000 2px solid;
  text-align: center;
  background: transparent;
}
</style>
