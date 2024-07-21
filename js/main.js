"usestrict";
$(document).ready(function () {
   $(".sk-folding-cube").fadeOut(2000, function () {
      $(this)
         .parent()
         .slideUp(1000, function () {
            $(this).remove();
            $("body").removeClass("overflow-hidden");
         });
   });
});
let openTime = 800;
let closeTime = 100;
let allData = [];
let apiUrl = {
   anotherSearch: (word) =>
      `https://api.themoviedb.org/3/${word}?api_key=48d62e7452a1f1a5e6018217ac27c50a`
};

(function () {
   getAllData(apiUrl.anotherSearch("movie/now_playing"));
})();
function openOrCloseAside() {
   let curentLeft = $("aside").css("left");
   let widthAside = $("aside .left").innerWidth();
   if (curentLeft == "0px") {
      $("aside").animate(
         {
            left: -widthAside,
         },
         700
      );
      for (let i = 0; i < $(".nav__items .nav__link").length; i++) {
         $(".nav__items .nav__link")
            .eq($(".nav__items .nav__link").length - i - 1)
            .animate(
               {
                  top: 300,
               },
               closeTime
            );
         closeTime += 100;
      }
      $("aside #btClose").find("i").addClass("fa-bars").removeClass("fa-xmark");
      closeTime = 100;
   } else {
      $("aside").animate(
         {
            left: 0,
         },
         700
      );
      // animation for li
      for (let i = 0; i < $(".nav__items .nav__link").length; i++) {
         $(".nav__items .nav__link").eq(i).animate(
            {
               top: 0,
            },
            openTime
         );
         openTime += 200;
      }
      $("aside #btClose").find("i").removeClass("fa-bars").addClass("fa-xmark");
      openTime = 800;
   }
}
async function getData(url) {
   const response = await (await fetch(url)).json()
   allData = response.results;
}
function displayData(list = allData) {
   $('#moviesBox').html(' <div class="text-center  my-3" id="loaderMov"><i class="fa-solid fa-spinner fa-spin  fa-3x text-secondary"></i></div>')
   setTimeout(() => {
      let dataBox = ``;
      list.forEach((item) => {
         dataBox += `
         <div class="col-md-6 col-lg-4">
         <div class="card h-100 ">
            <img
               src="https://image.tmdb.org/t/p/original${item.poster_path}"
               alt="movies photo"
               class="w-100"
               onerror="this.src='../images/not-found.svg'"
            />
            <div
               class="layer bg-light bg-opacity-75 text-dark vstack justify-content-center text-center"
            >
               <h2 class="display-6 fs-3">
                  ${item.original_title}
               </h2>
               <p class="my-3 ">
                ${item.overview}
               </p>
               <span class="mb-3">rate: ${item.vote_average}</span>
               <span>${item.release_date} </span>
            </div>
         </div>
      </div>
         `;
      });
      $("#moviesBox").html(dataBox);
   }, 800);

}
function getDataWord() {
   let curentValue = $(this).val();
   if (curentValue.length > 0) getAllData(apiUrl.searchWord(curentValue));
}
function getDataIn() {
   let searchIn = [];
   let curentVal = $(this).val();
   allData.forEach((item) => {
      if (item.original_title.toLowerCase().includes(curentVal.toLowerCase())) {
         searchIn.push(item);
      }
   });
   if (curentVal.length > 0) {
      displayData(searchIn);
   } else {
      displayData();
   }
}
function getDataNav(e) {
   const curentHref = $(e.target).attr("href");
   getAllData(apiUrl.anotherSearch(curentHref));
}
async function getAllData(url) {
   await getData(url);
   displayData();
}
const validationForm = {
   regexUser: /^[a-zA-Z][a-zA-Z\s]{1,20}$/,
   regexEmail: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
   regexPhone: /^(002)?01[0125]\d{8}$/,
   regexAge: /^([1-7][0-9]|80)$/,
   regexPass: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
   regexCheck: function (regexStyle, num) {
      return regexStyle.test($(".contact__us input").eq(num).val())
         ? ($(".contact__us input").eq(num).next().addClass("d-none"), true)
         : ($(".contact__us input").eq(num).next().removeClass("d-none"),
            false);
   },
   checkRePass: function () {
      if (
         $(".contact__us input").eq(4).val() ==
         $(".contact__us input").eq(5).val()
      ) {
         return $(".contact__us input").eq(5).next().addClass("d-none"), true;
      } else {
         return (
            $(".contact__us input").eq(5).next().removeClass("d-none"), false
         );
      }
   },
};

$("#btClose").click(openOrCloseAside);

$("#searchIn").on("input", getDataIn);

$(".nav__link a")
   .not('[href^="#"]')
   .click(function (e) {
      e.preventDefault();
      getDataNav(e);
   });

$("form").on("click keyup", function (e) {
   validationForm.regexCheck(validationForm.regexUser, 0) &&
      validationForm.regexCheck(validationForm.regexEmail, 1) &&
      validationForm.regexCheck(validationForm.regexPhone, 2) &&
      validationForm.regexCheck(validationForm.regexAge, 3) &&
      validationForm.regexCheck(validationForm.regexPass, 4) &&
      validationForm.checkRePass()
      ? $("#submitBtn").attr("disabled", false)
      : $("#submitBtn").attr("disabled", true);
});
$('form').submit(function (e) {
   e.preventDefault();
   this.submit()
   this.reset()
});