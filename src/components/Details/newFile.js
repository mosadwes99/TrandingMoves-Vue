import { defineEmits, defineProps, onMounted, ref } from "vue";
import GetData from "../../hooks/GetData";
import GetRate from "../../hooks/GetRate";
import { watch } from "vue";
import GetVideo from "../../hooks/GetVideo";
import CastSlider from "./CastSlider.vue";
import { db } from "../../FireStore/store";
import Cookie from "universal-cookie";
import {
arrayRemove,
arrayUnion,
collection,
doc,
getDocs,
query,
updateDoc,
where,
deleteDoc,
addDoc
} from "firebase/firestore";

//variables
export default (() => {
const __VLS_setup = async () => {
let cookie = new Cookie();
let { url, type, id } = defineProps(["url", "type", "id"]);
let { content, getData } = GetData();
let { rate, getRate } = GetRate();
let { videoKey, getVideo } = GetVideo();
let emit = defineEmits(["stopLoading"]);
let arrow = `<svg class="dark:fill-white fill-fourth transition-colors duration-500 w-3" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>`;
let star = `<svg class="w-8" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#ffd57a}</style><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>`;
let heart = `<svg xmlns="http://www.w3.org/2000/svg" id="heart" :class="" class="fill-white cursor-pointer hover:fill-pramiary transitions-colors duration-200" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#ffffff}</style><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>`;
let heartPramiary = `<svg xmlns="http://www.w3.org/2000/svg" id="heart" :class="" class="fill-pramiary cursor-pointer hover:fill-pramiary transitions-colors duration-200" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#ffffff}</style><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>`;
let heartColor = ref("");
let wishlistValue = ref("");
//functions
onMounted(() => {
getData(url);
getVideo(`
https://api.themoviedb.org/3/${type}/${id}/videos
`);
});

watch(content, () => {
getRate(content.value.imdb_id);
});

watch(content, () => {
emit("stopLoading", false);
});

onMounted(() => {
heartStyle();
});

async function getDataFireStore() {
let q = query(
collection(db, "users"),
where("uid", "==", "K6CDuXmmVya5Y6KEY4xS")
);
let querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
let Data = doc.data();
localStorage.setItem("wishlist", JSON.stringify(Data.wishlist));
localStorage.setItem("likes", JSON.stringify(Data.likes));
});
emit("stopLoading", false);
heartColor.value = !heartColor.value;
}

async function handleLike() {
let likes = localStorage.getItem("likes");
emit("stopLoading", true);
likes = JSON.parse(likes);
if (cookie.get("login")) {
let likedRef = doc(db, "users", "K6CDuXmmVya5Y6KEY4xS");
if (likes.some((item) => item === id)) {
await updateDoc(likedRef, {
likes: arrayRemove(id),
});
getDataFireStore();
} else {
await updateDoc(likedRef, {
likes: arrayUnion(id),
}).then(() => getDataFireStore());
}
} else {
}
}

function heartStyle() {
let likes = [];
likes = localStorage.getItem("likes");
likes = JSON.parse(likes);
if (likes.some((item) => item === id)) {
heartColor.value = true;
} else {
heartColor.value = false;
}
}

async function handleWishlist() {
let wishlist = localStorage.getItem("wishlist");
emit("stopLoading", true);
wishlist = JSON.parse(wishlist);
if (cookie.get("login")) {
let wishlistRef = query(
collection(db, "wishlists"),
where("userUid", "==", "K6CDuXmmVya5Y6KEY4xS"),
where("uid", "==", id)
);

let userWishlist = doc(db, "users", "K6CDuXmmVya5Y6KEY4xS");
let list = [];
list = wishlist.filter((item) => item.id == id);
if (wishlist.some((item) => item.id === id)) {
console.log();
if (list.value === wishlistValue.value) {
await updateDoc(userWishlist, {
wishlist: arrayRemove({
id: id,
}),
});
await deleteDoc(wishlistRef);
} else {
await updateDoc(userWishlist, {
wishlist: arrayUnion({
id: id,
value: wishlistValue.value,
}),
});
await updateDoc(wishlistRef, {
value: wishlistValue.value,
});
}
getDataFireStore();
} else {
await updateDoc(userWishlist, {
wishlist: arrayUnion({
id: id,
value: wishlistValue.value,
}),
});
await addDoc(collection(db, "wishlists"), {
value: wishlistValue.value,
uid: id,
userUid: "K6CDuXmmVya5Y6KEY4xS",
});
getDataFireStore();
}
} else {
}
}
const __VLS_publicComponent = (await import('vue')).defineComponent({
setup() {
return {
$props: (await import('./__VLS_types.js')).makeOptional(defineProps(["url", "type", "id"])),
$emit: emit,
};
},
});

const __VLS_componentsOption = {};

let __VLS_name!: 'MainBox';
function __VLS_template() {
let __VLS_ctx!: InstanceType<import('./__VLS_types.js').PickNotAny<typeof __VLS_publicComponent, new () => {}>> & InstanceType<import('./__VLS_types.js').PickNotAny<typeof __VLS_internalComponent, new () => {}>> & {};
/* Components */
let __VLS_localComponents!: NonNullable<typeof __VLS_internalComponent extends { components: infer C; } ? C : {}> & typeof __VLS_componentsOption & typeof __VLS_ctx;
let __VLS_otherComponents!: typeof __VLS_localComponents & import('./__VLS_types.js').GlobalComponents;
let __VLS_own!: import('./__VLS_types.js').SelfComponent<typeof __VLS_name, typeof __VLS_internalComponent & typeof __VLS_publicComponent & (new () => { $slots: typeof __VLS_slots; }) >;
let __VLS_components!: typeof __VLS_otherComponents & Omit<typeof __VLS_own, keyof typeof __VLS_otherComponents>;
/* Style Scoped */
type __VLS_StyleScopedClasses = {};
let __VLS_styleScopedClasses!: __VLS_StyleScopedClasses | keyof __VLS_StyleScopedClasses | (keyof __VLS_StyleScopedClasses)[];
/* CSS variable injection */
/* CSS variable injection end */
let __VLS_templateComponents!: {} &
import('./__VLS_types.js').WithComponent<'CastSlider', typeof __VLS_components, 'CastSlider'>;
__VLS_components.CastSlider;
// @ts-ignore
[CastSlider,];
{
({} as JSX.IntrinsicElements).div;
({} as JSX.IntrinsicElements).div;
(__VLS_x as JSX.IntrinsicElements)['div'] = { class: ("w-full flex lg:flex-row flex-col gap-6"), };
if (__VLS_ctx.rate) {
// @ts-ignore
[rate,];
{
({} as JSX.IntrinsicElements).div;
({} as JSX.IntrinsicElements).div;
(__VLS_x as JSX.IntrinsicElements)['div'] = { class: ("lg:w-[40%] w-[95%] mx-auto flex flex-col gap-4"), };
{
({} as JSX.IntrinsicElements).div;
({} as JSX.IntrinsicElements).div;
(__VLS_x as JSX.IntrinsicElements)['div'] = { class: ("w-full flex gap-1 transition-colors duration-500 items-center rounded-md overflow-hidden dark:bg-fourth bg-white shadow-slate-400 dark:shadow-black/50 shadow-lg dark:text-white p-1 px-4 lg:text-lg"), };
{
({} as JSX.IntrinsicElements).p;
({} as JSX.IntrinsicElements).p;
(__VLS_x as JSX.IntrinsicElements)['p'] = { class: ("whitespace-nowrap lg:w-fit t"), };
}
{
({} as JSX.IntrinsicElements).p;
({} as JSX.IntrinsicElements).p;
(__VLS_x as JSX.IntrinsicElements)['p'] = {};
(await import('./__VLS_types.js')).directiveFunction(__VLS_ctx.vHtml)(__VLS_ctx.arrow);
// @ts-ignore
[arrow,];
}
{
({} as JSX.IntrinsicElements).p;
({} as JSX.IntrinsicElements).p;
(__VLS_x as JSX.IntrinsicElements)['p'] = {};
(__VLS_ctx.type);
// @ts-ignore
[type,];
}
{
({} as JSX.IntrinsicElements).p;
({} as JSX.IntrinsicElements).p;
(__VLS_x as JSX.IntrinsicElements)['p'] = {};
(await import('./__VLS_types.js')).directiveFunction(__VLS_ctx.vHtml)(__VLS_ctx.arrow);
// @ts-ignore
[arrow,];
}
{
({} as JSX.IntrinsicElements).p;
({} as JSX.IntrinsicElements).p;
(__VLS_x as JSX.IntrinsicElements)['p'] = { class: ("truncate"), };
(__VLS_ctx.content.title);
// @ts-ignore
[content,];
}
}
{
({} as JSX.IntrinsicElements).div;
({} as JSX.IntrinsicElements).div;
(__VLS_x as JSX.IntrinsicElements)['div'] = { class: ("w-full flex lg:flex-row flex-col gap-4"), };
{
({} as JSX.IntrinsicElements).div;
({} as JSX.IntrinsicElements).div;
(__VLS_x as JSX.IntrinsicElements)['div'] = { class: ("lg:w-1/2 relative"), };
{
({} as JSX.IntrinsicElements).img;
(__VLS_x as JSX.IntrinsicElements)['img'] = { src: (('https://image.tmdb.org/t/p/original' + __VLS_ctx.content.poster_path)), class: ("w-full"), alt: (""), };
// @ts-ignore
[content,];
}
if (__VLS_ctx.heartColor) {
// @ts-ignore
[heartColor,];
{
({} as JSX.IntrinsicElements).span;
({} as JSX.IntrinsicElements).span;
(__VLS_x as JSX.IntrinsicElements)['span'] = { class: ("active:scale-95 text-4xl absolute top-4 end-4"), };
(await import('./__VLS_types.js')).directiveFunction(__VLS_ctx.vHtml)(__VLS_ctx.heartPramiary);
// @ts-ignore
[heartPramiary,];
type __VLS_0 = JSX.IntrinsicElements['span'];
const __VLS_1: import('./__VLS_types.js').EventObject<typeof undefined, 'click', {}, __VLS_0['onClick']> = {
click: (__VLS_ctx.handleLike)
};
// @ts-ignore
[handleLike,];
}
}
else {
{
({} as JSX.IntrinsicElements).span;
({} as JSX.IntrinsicElements).span;
(__VLS_x as JSX.IntrinsicElements)['span'] = { class: ("active:scale-95 text-4xl absolute top-4 end-4"), };
(await import('./__VLS_types.js')).directiveFunction(__VLS_ctx.vHtml)(__VLS_ctx.heart);
// @ts-ignore
[heart,];
type __VLS_2 = JSX.IntrinsicElements['span'];
const __VLS_3: import('./__VLS_types.js').EventObject<typeof undefined, 'click', {}, __VLS_2['onClick']> = {
click: (__VLS_ctx.handleLike)
};
// @ts-ignore
[handleLike,];
}
}
}
{
({} as JSX.IntrinsicElements).div;
({} as JSX.IntrinsicElements).div;
(__VLS_x as JSX.IntrinsicElements)['div'] = { class: ("bg-white lg:w-1/2 flex flex-col gap-4 justify-between items-center rounded-md overflow-hidden shadow-slate-400 dark:shadow-black/50 shadow-lg dark:text-white transition-colors duration-500 dark:bg-fourth p-4"), };
{
({} as JSX.IntrinsicElements).div;
({} as JSX.IntrinsicElements).div;
(__VLS_x as JSX.IntrinsicElements)['div'] = { class: ("flex flex-col gap-2 w-full"), };
{
({} as JSX.IntrinsicElements).div;
({} as JSX.IntrinsicElements).div;
(__VLS_x as JSX.IntrinsicElements)['div'] = { class: ("flex flex-col gap-2 w-full"), };
{
({} as JSX.IntrinsicElements).div;
({} as JSX.IntrinsicElements).div;
(__VLS_x as JSX.IntrinsicElements)['div'] = { class: ("flex flex-col w-full gap-2"), };
{
({} as JSX.IntrinsicElements).p;
({} as JSX.IntrinsicElements).p;
(__VLS_x as JSX.IntrinsicElements)['p'] = { class: ("text-xl font-semibold text-pramiary truncate w-full"), };
(__VLS_ctx.content.title || __VLS_ctx.content.name);
// @ts-ignore
[content, content,];
}
}
{
({} as JSX.IntrinsicElements).p;
({} as JSX.IntrinsicElements).p;
(__VLS_x as JSX.IntrinsicElements)['p'] = {};
(__VLS_ctx.content.overview);
// @ts-ignore
[content,];
}
}
{
({} as JSX.IntrinsicElements).div;
({} as JSX.IntrinsicElements).div;
(__VLS_x as JSX.IntrinsicElements)['div'] = { class: ("py-2 rounded-md flex justify-between items-center"), };
{
({} as JSX.IntrinsicElements).span;
({} as JSX.IntrinsicElements).span;
(__VLS_x as JSX.IntrinsicElements)['span'] = { class: ("bg-secondary p-1 rounded-lg font-semibold text-lg text-black"), };
}
{
({} as JSX.IntrinsicElements).p;
({} as JSX.IntrinsicElements).p;
(__VLS_x as JSX.IntrinsicElements)['p'] = { class: ("text-2xl flex gap-[2px] items-center"), };
(__VLS_ctx.rate.rating);
// @ts-ignore
[rate,];
{
({} as JSX.IntrinsicElements).span;
({} as JSX.IntrinsicElements).span;
(__VLS_x as JSX.IntrinsicElements)['span'] = { class: ("text-sm"), };
}
{
({} as JSX.IntrinsicElements).span;
({} as JSX.IntrinsicElements).span;
(__VLS_x as JSX.IntrinsicElements)['span'] = {};
(await import('./__VLS_types.js')).directiveFunction(__VLS_ctx.vHtml)(__VLS_ctx.star);
// @ts-ignore
[star,];
}
}
}
{
({} as JSX.IntrinsicElements).div;
({} as JSX.IntrinsicElements).div;
(__VLS_x as JSX.IntrinsicElements)['div'] = { class: ("flex flex-wrap gap-2 w-full"), };
for (const [item] of (await import('./__VLS_types.js')).getVForSourceType(__VLS_ctx.content.genres)) {
// @ts-ignore
[content,];
{
({} as JSX.IntrinsicElements).div;
({} as JSX.IntrinsicElements).div;
(__VLS_x as JSX.IntrinsicElements)['div'] = { class: ("p-2 bg-gray-200 dark:bg-gray-600 rounded-lg"), };
(item.name);
}
}
}
}
{
({} as JSX.IntrinsicElements).div;
({} as JSX.IntrinsicElements).div;
(__VLS_x as JSX.IntrinsicElements)['div'] = { class: ("w-full"), };
if (__VLS_ctx.videoKey) {
// @ts-ignore
[videoKey,];
{
({} as JSX.IntrinsicElements).a;
({} as JSX.IntrinsicElements).a;
(__VLS_x as JSX.IntrinsicElements)['a'] = { class: (""), target: ("_blank"), href: (('https://www.youtube.com/watch?v=' + __VLS_ctx.videoKey)), };
// @ts-ignore
[videoKey,];
{
({} as JSX.IntrinsicElements).button;
({} as JSX.IntrinsicElements).button;
(__VLS_x as JSX.IntrinsicElements)['button'] = { class: ("w-full bg-pramiary active:scale-95 cursor-pointer text-white p-2 rounded-lg font-semibold mx-auto"), };
}
}
}
else {
{
({} as JSX.IntrinsicElements).button;
({} as JSX.IntrinsicElements).button;
(__VLS_x as JSX.IntrinsicElements)['button'] = { disabled: (true), class: ("w-full bg-gray-600 cursor-pointer text-white p-2 rounded-lg font-semibold mx-auto"), };
}
}
}
}
}
}
}
else {
{
({} as JSX.IntrinsicElements).div;
({} as JSX.IntrinsicElements).div;
(__VLS_x as JSX.IntrinsicElements)['div'] = { class: ("lg:w-[40%] w-[95%] flex flex-col gap-4"), };
{
({} as JSX.IntrinsicElements).div;
({} as JSX.IntrinsicElements).div;
(__VLS_x as JSX.IntrinsicElements)['div'] = { class: ("w-full rounded-lg bg-gray-600 animate-pulse h-9"), };
}
{
({} as JSX.IntrinsicElements).div;
({} as JSX.IntrinsicElements).div;
(__VLS_x as JSX.IntrinsicElements)['div'] = { class: ("flex flex-col h-[34rem] gap-4 lg:flex-row"), };
{
({} as JSX.IntrinsicElements).div;
({} as JSX.IntrinsicElements).div;
(__VLS_x as JSX.IntrinsicElements)['div'] = { class: ("w-1/2 h-full bg-gray-600 animate-pulse"), };
}
{
({} as JSX.IntrinsicElements).div;
({} as JSX.IntrinsicElements).div;
(__VLS_x as JSX.IntrinsicElements)['div'] = { class: ("w-1/2 h-full rounded-lg bg-gray-600 animate-pulse"), };
}
}
}
}
{
({} as JSX.IntrinsicElements).div;
({} as JSX.IntrinsicElements).div;
(__VLS_x as JSX.IntrinsicElements)['div'] = { class: ("lg:w-[60%] w-[95%] mx-auto flex flex-col"), };
{
({} as JSX.IntrinsicElements).div;
({} as JSX.IntrinsicElements).div;
(__VLS_x as JSX.IntrinsicElements)['div'] = { class: ("flex gap-4 flex-col-reverse lg:flex-row-reverse justify-end w-full"), };
{
({} as JSX.IntrinsicElements).div;
({} as JSX.IntrinsicElements).div;
(__VLS_x as JSX.IntrinsicElements)['div'] = { class: ("w-full"), };
{
({} as JSX.IntrinsicElements).label;
({} as JSX.IntrinsicElements).label;
(__VLS_x as JSX.IntrinsicElements)['label'] = { class: ("label w-fit"), };
{
({} as JSX.IntrinsicElements).span;
({} as JSX.IntrinsicElements).span;
(__VLS_x as JSX.IntrinsicElements)['span'] = { class: ("text-pramiary label-text -mb-1"), };
}
}
{
({} as JSX.IntrinsicElements).select;
({} as JSX.IntrinsicElements).select;
(__VLS_x as JSX.IntrinsicElements)['select'] = { value: ((__VLS_ctx.wishlistValue)), class: ("select select-bordered w-full dark:text-white transition-colors duration-500 dark:bg-fourth"), };
type __VLS_4 = JSX.IntrinsicElements['select'];
const __VLS_5: import('./__VLS_types.js').EventObject<typeof undefined, 'change', {}, __VLS_4['onChange']> = {
change: (__VLS_ctx.handleWishlist)
};
// @ts-ignore
[wishlistValue, handleWishlist,];
{
({} as JSX.IntrinsicElements).option;
({} as JSX.IntrinsicElements).option;
(__VLS_x as JSX.IntrinsicElements)['option'] = {};
}
{
({} as JSX.IntrinsicElements).option;
({} as JSX.IntrinsicElements).option;
(__VLS_x as JSX.IntrinsicElements)['option'] = {};
}
{
({} as JSX.IntrinsicElements).option;
({} as JSX.IntrinsicElements).option;
(__VLS_x as JSX.IntrinsicElements)['option'] = {};
}
{
({} as JSX.IntrinsicElements).option;
({} as JSX.IntrinsicElements).option;
(__VLS_x as JSX.IntrinsicElements)['option'] = {};
}
{
({} as JSX.IntrinsicElements).option;
({} as JSX.IntrinsicElements).option;
(__VLS_x as JSX.IntrinsicElements)['option'] = {};
}
}
}
{
({} as JSX.IntrinsicElements).div;
({} as JSX.IntrinsicElements).div;
(__VLS_x as JSX.IntrinsicElements)['div'] = { class: ("dark:text-white flex flex-col gap-4 w-full shadow-lg p-4 transition-colors duration-500 dark:bg-fourth shadow-slate-400 rounded-lg bg-white dark:shadow-black/50"), };
{
({} as JSX.IntrinsicElements).div;
({} as JSX.IntrinsicElements).div;
(__VLS_x as JSX.IntrinsicElements)['div'] = { class: ("flex items-center gap-2"), };
{
({} as JSX.IntrinsicElements).p;
({} as JSX.IntrinsicElements).p;
(__VLS_x as JSX.IntrinsicElements)['p'] = { class: ("w-1/3"), };
}
{
({} as JSX.IntrinsicElements).span;
({} as JSX.IntrinsicElements).span;
(__VLS_x as JSX.IntrinsicElements)['span'] = { class: ("w-1/2 h-1 rounded-3xl bg-third"), };
}
{
({} as JSX.IntrinsicElements).p;
({} as JSX.IntrinsicElements).p;
(__VLS_x as JSX.IntrinsicElements)['p'] = {};
}
}
{
({} as JSX.IntrinsicElements).div;
({} as JSX.IntrinsicElements).div;
(__VLS_x as JSX.IntrinsicElements)['div'] = { class: ("flex items-center gap-2"), };
{
({} as JSX.IntrinsicElements).p;
({} as JSX.IntrinsicElements).p;
(__VLS_x as JSX.IntrinsicElements)['p'] = { class: ("w-1/3"), };
}
{
({} as JSX.IntrinsicElements).span;
({} as JSX.IntrinsicElements).span;
(__VLS_x as JSX.IntrinsicElements)['span'] = { class: ("w-1/2 h-1 rounded-3xl bg-third"), };
}
{
({} as JSX.IntrinsicElements).p;
({} as JSX.IntrinsicElements).p;
(__VLS_x as JSX.IntrinsicElements)['p'] = {};
}
}
{
({} as JSX.IntrinsicElements).div;
({} as JSX.IntrinsicElements).div;
(__VLS_x as JSX.IntrinsicElements)['div'] = { class: ("flex items-center gap-2"), };
{
({} as JSX.IntrinsicElements).p;
({} as JSX.IntrinsicElements).p;
(__VLS_x as JSX.IntrinsicElements)['p'] = { class: ("w-1/3"), };
}
{
({} as JSX.IntrinsicElements).span;
({} as JSX.IntrinsicElements).span;
(__VLS_x as JSX.IntrinsicElements)['span'] = { class: ("w-1/2 h-1 rounded-3xl bg-third"), };
}
{
({} as JSX.IntrinsicElements).p;
({} as JSX.IntrinsicElements).p;
(__VLS_x as JSX.IntrinsicElements)['p'] = {};
}
}
{
({} as JSX.IntrinsicElements).div;
({} as JSX.IntrinsicElements).div;
(__VLS_x as JSX.IntrinsicElements)['div'] = { class: ("flex items-center gap-2"), };
{
({} as JSX.IntrinsicElements).p;
({} as JSX.IntrinsicElements).p;
(__VLS_x as JSX.IntrinsicElements)['p'] = { class: ("w-1/3"), };
}
{
({} as JSX.IntrinsicElements).span;
({} as JSX.IntrinsicElements).span;
(__VLS_x as JSX.IntrinsicElements)['span'] = { class: ("w-1/2 h-1 rounded-3xl bg-third"), };
}
{
({} as JSX.IntrinsicElements).p;
({} as JSX.IntrinsicElements).p;
(__VLS_x as JSX.IntrinsicElements)['p'] = {};
}
}
}
}
{
({} as JSX.IntrinsicElements).div;
({} as JSX.IntrinsicElements).div;
(__VLS_x as JSX.IntrinsicElements)['div'] = { class: ("w-full flex flex-col lg:flex-row flex-wrap justify-between items-start gap-4 py-4 dark:text-white"), };
{
({} as JSX.IntrinsicElements).div;
({} as JSX.IntrinsicElements).div;
(__VLS_x as JSX.IntrinsicElements)['div'] = { class: ("flex gap-[1px] flex-col w-full h-fit lg:w-1/4 bg-pramiary rounded-t-md text-center"), };
{
({} as JSX.IntrinsicElements).div;
({} as JSX.IntrinsicElements).div;
(__VLS_x as JSX.IntrinsicElements)['div'] = { class: ("p-2 text-white"), };
}
{
({} as JSX.IntrinsicElements).span;
({} as JSX.IntrinsicElements).span;
(__VLS_x as JSX.IntrinsicElements)['span'] = { class: ("p-2 dark:bg-fourth bg-white"), };
(
__VLS_ctx.content.release_date || "Unknown"
);
// @ts-ignore
[content,];
}
}
{
({} as JSX.IntrinsicElements).div;
({} as JSX.IntrinsicElements).div;
(__VLS_x as JSX.IntrinsicElements)['div'] = { class: ("flex gap-[1px] flex-col w-full h-fit lg:w-1/4 bg-pramiary rounded-t-md text-center"), };
{
({} as JSX.IntrinsicElements).div;
({} as JSX.IntrinsicElements).div;
(__VLS_x as JSX.IntrinsicElements)['div'] = { class: ("p-2 text-white"), };
}
for (const [item] of (await import('./__VLS_types.js')).getVForSourceType(__VLS_ctx.content.spoken_languages)) {
// @ts-ignore
[content,];
{
({} as JSX.IntrinsicElements).span;
({} as JSX.IntrinsicElements).span;
(__VLS_x as JSX.IntrinsicElements)['span'] = { class: ("p-2 dark:bg-fourth bg-white"), };
(item.english_name);
}
}
}
{
({} as JSX.IntrinsicElements).div;
({} as JSX.IntrinsicElements).div;
(__VLS_x as JSX.IntrinsicElements)['div'] = { class: ("flex gap-[1px] flex-col w-full h-fit lg:w-1/4 bg-pramiary rounded-t-md text-center"), };
{
({} as JSX.IntrinsicElements).div;
({} as JSX.IntrinsicElements).div;
(__VLS_x as JSX.IntrinsicElements)['div'] = { class: ("p-2 text-white"), };
}
for (const [item] of (await import('./__VLS_types.js')).getVForSourceType(__VLS_ctx.content.production_countries)) {
// @ts-ignore
[content,];
{
({} as JSX.IntrinsicElements).span;
({} as JSX.IntrinsicElements).span;
(__VLS_x as JSX.IntrinsicElements)['span'] = { class: ("p-2 dark:bg-fourth bg-white"), };
(item.name);
}
}
}
{
({} as JSX.IntrinsicElements).div;
({} as JSX.IntrinsicElements).div;
(__VLS_x as JSX.IntrinsicElements)['div'] = { class: ("flex gap-[1px] flex-col w-full h-fit lg:w-1/4 bg-pramiary rounded-t-md text-center"), };
{
({} as JSX.IntrinsicElements).div;
({} as JSX.IntrinsicElements).div;
(__VLS_x as JSX.IntrinsicElements)['div'] = { class: ("p-2 text-white"), };
}
for (const [item] of (await import('./__VLS_types.js')).getVForSourceType(__VLS_ctx.content.production_companies)) {
// @ts-ignore
[content,];
{
({} as JSX.IntrinsicElements).span;
({} as JSX.IntrinsicElements).span;
(__VLS_x as JSX.IntrinsicElements)['span'] = { class: ("p-2 dark:bg-fourth bg-white"), };
(item.name);
}
}
}
}
}
}
{
(__VLS_x as import('./__VLS_types.js').ComponentProps<typeof __VLS_templateComponents.CastSlider>) = { id: ((__VLS_ctx.id)), type: ((__VLS_ctx.type)), };
// @ts-ignore
[id, type,];
}
if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
}
declare var __VLS_slots: {};
return __VLS_slots;
}
const __VLS_internalComponent = (await import('vue')).defineComponent({
setup() {
return {
...{ url, type, id },
CastSlider: CastSlider,
type: type,
id: id,
content: content,
rate: rate,
videoKey: videoKey,
arrow: arrow,
star: star,
heart: heart,
heartPramiary: heartPramiary,
heartColor: heartColor,
wishlistValue: wishlistValue,
handleLike: handleLike,
handleWishlist: handleWishlist,
};
},
});
return {} as typeof __VLS_publicComponent;
};
return {} as typeof __VLS_setup extends () => Promise<infer T> ? T : never;
})({} as any);
