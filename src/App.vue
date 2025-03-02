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

html {
  width: 100%;
  overflow-x: hidden;
}

#app {
  width: 100%;
  min-height: 100vh;
  height: 100vh;
}

.icon-button {
  width: 40px;
  height: 40px;
  border: 0;
  background-color: #eeeeee;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-.primary {
  background-color: #aaaaaa;
}

.icon-.silent {
  background-color: transparent;
}

.icon-button:hover {
  background-color: #cccccc;
}

.icon-button:active {
  background-color: #aaaaaa;
}

.text-button {
  background-color: #eeeeee;
  color: #000000;
  font-weight: bolder;
  height: 40px;
  min-width: 100px;
  width: fit-content;

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  border-radius: 26px;
  border: transparent 2px solid;
}

.text-.primary {
  background-color: #000000;
  color: #ffffff;
}

.text-.silent {
  background-color: transparent;
  color: #000000;
  border: #cccccc 1px solid;
}

.text-button:hover {
  background-color: #cccccc;
}

.text-button:active {
  background-color: #aaaaaa;
}

.text-button:focus {
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
