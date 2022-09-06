const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const recipesList = document.querySelector('.recipes-list');
const modal = document.querySelector(".modal");


searchBtn.addEventListener("click", getRecipes);

const getData = ({ meals }) => {
    recipesList.innerHTML = "";
    for (let i = 0; i < meals.length; i++) {
        const meal = meals[i]
        recipesList.innerHTML += `<div class=recipe-box>
        <span>${meal.strArea}</span>
            <img src='${meal.strMealThumb}' />
            <p>
                ${meal.strMeal.slice(0, 10)}...    
            </p>
            <button onclick="openModal('${meal.idMeal}')" class=view-btn>View</button>
            </div>`;

    }
    console.log(meals);
}



// функция, которая делает запросы в сервер, then - ассинхронный запрос. JSON - спарсили данные с сайта
function getRecipes() {
    const recipesName = searchInput.value
    console.log(recipesName);
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${recipesName}`) // s= поиск
        .then(responce => responce.json())
        .then(data => getData(data));
    searchInput.value = ""; // пустое поле поиска после запроса данных
}

function closeModal() {
    modal.style.display = "none"
}
function getValuesByKey(meal, keyField) {
    const arrFromObj = Object.entries(meal)
    const allIngredients = arrFromObj.filter(([key, value]) => {
        return key.includes(keyField) && value !== ''
    }).filter(([_, val]) => val !== null).map(([_, val]) => val)
    return allIngredients
}

async function openModal(id) {
    const data = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    const { meals } = await data.json();
    const [meal] = meals;
    modal.style.display = "flex";

    const ingredients = getValuesByKey(meal, 'strIngredient')
    const measures = getValuesByKey(meal, 'strMeasure')
    console.log(ingredients);
    modal.innerHTML = `
    <div class=modal-container>
    <button onclick="closeModal()" class=close-btn>
    <i class="fa fa-times" aria-hidden="true"></i>
    </button>
    <div class=left-part>
        <img src=${meal.strMealThumb} />
        </div>
        <div class=right-part>
        <h2 class=right-part__header>${meal.strMeal}</h2>
        <p class=right-part__instructions>${meal.strInstructions}</p>
        <div class=ingredients-measurements-container>
        <ul class=ingredients></ul>
        <ul class=measures></ul>
        </div>
        ${meal.strYoutube && `<a class=watch-video href="${meal.strYoutube}
        target="_blank>watch video</a>`}
        </div>
    </div>`;

    const ingredientsEl = document.querySelector('.ingredients');
    const measuresEl = document.querySelector('.measures');
    
    for (let i = 0; i < ingredients.length; i++) {
        const ingredient = ingredients[i];
        ingredientsEl.innerHTML +=
        `<li>${ingredient}</li>`
    }

    for (let i = 0; i < measures.length; i++) {
        const measure = measures[i];
        measuresEl.innerHTML +=
        `<li>${measure}</li>`
        
    }
}


