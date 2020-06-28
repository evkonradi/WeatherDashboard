selectedCitiesEl = document.querySelector("#selectedCities");
searchCityInputEl = document.querySelector("#searchCityInput");
var selectedCitiesAr = [];

//Add a new city to the list of selected cities and save to Local Storage
var addCityToList = function(cityName){
    var liEl = document.createElement("li");
    liEl.innerHTML = cityName;
    liEl.className= "list-group-item";
    liEl.setAttribute("data-city",cityName);
    selectedCitiesEl.appendChild(liEl);
}

//Save new city to Local Storage
var addNewCityToLocalStorage = function(cityName){
    selectedCitiesAr.push(cityName);
    localStorage.setItem("citiesWeather", JSON.stringify(selectedCitiesAr));
}

//Read the City List from the Local Storage
var readCitiesList = function(){
    var listItems = localStorage.getItem("citiesWeather");
    if (listItems){
        selectedCitiesAr = JSON.parse(listItems);

        for (i = 0; i < selectedCitiesAr.length; i++){
            addCityToList(selectedCitiesAr[i]);
        }

    }
}

//API to get current UV index
var getCurrentUVIndex = function(lon, lat){
    var apiUrlVIndex = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=54f32668a2bf6aeb6c55df89a2e807fb";

    fetch(apiUrlVIndex).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var elUVIndex = document.getElementById("UVIndex");
                elUVIndex.innerHTML = data.value;
                if (data.value<=2)
                    elUVIndex.style.backgroundColor = "green";
                else if (data.value<=5)
                    elUVIndex.style.backgroundColor = "yellow";
                else if (data.value<=7)
                    elUVIndex.style.backgroundColor = "orange";
                else if (data.value<=10)
                    elUVIndex.style.backgroundColor = "red";
                else
                    elUVIndex.style.backgroundColor = "purple";
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error){
        alert(error);
    });
}

//API to get current weather
var getCurrentWeather = function(cityName){
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=54f32668a2bf6aeb6c55df89a2e807fb";
  
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var containerCurWeather = document.getElementById("containerCurWeather");
                containerCurWeather.className = containerCurWeather.className.replace(/\binvisible\b/g, "visible");
                document.getElementById("cityNameWeather").innerHTML = cityName + "&nbsp;&nbsp;(" + moment().format("M/DD/YYYY") + ")";
                document.getElementById("currentWeatherIcon").src = "http://openweathermap.org/img/wn/" + data.weather[0].icon + ".png";
                document.getElementById("temperature").innerHTML = data.main.temp + " °F";
                document.getElementById("humidity").innerHTML = data.main.temp + " %";
                document.getElementById("windSpeed").innerHTML = data.wind.speed + " MPH";
                document.getElementById("UVIndex").innerHTML = data.main.temp;
                getCurrentUVIndex(data.coord.lon, data.coord.lat);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error){
        alert(error);
    });
}

// Get 5 days forecast
var get5daysWeather = function(cityName){
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=54f32668a2bf6aeb6c55df89a2e807fb";
  
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {

                console.log(data);
                
                // get 3pm weather conditions
                for (i=4; i< data.list.length; i=i+8){

                    var container5DaysWeather = document.getElementById("container5DaysWeather");
                    container5DaysWeather.className = container5DaysWeather.className.replace(/\binvisible\b/g, "visible");

                    var container5DaysHeading = document.getElementById("container5DaysHeading");
                    container5DaysHeading.className = container5DaysHeading.className.replace(/\binvisible\b/g, "visible");

                    var cardEl = document.getElementById("card" + ((i-4)/8+1) );
                    cardEl.className = "card-body bg-primary text-white rounded-sm";
                    
                    var h5El = document.createElement("h5");
                    h5El.innerHTML= moment(data.list[i].dt_txt).format("MM/DD/YYYY");
                    cardEl.appendChild(h5El);

                    var imgIcon = document.createElement("img");
                    imgIcon.src = "http://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + ".png";
                    cardEl.appendChild(imgIcon);

                    var tempEl = document.createElement("div");
                    tempEl.innerHTML = "Temp:&nbsp;&nbsp;" + data.list[i].main.temp + "°F";
                    cardEl.appendChild(tempEl);

                    var humidityEl = document.createElement("div");
                    humidityEl.innerHTML = "Humidity:&nbsp;&nbsp;" + data.list[i].main.humidity + "%";
                    cardEl.appendChild(humidityEl);

                }
                //document.getElementById("cityNameWeather").innerHTML = cityName + "&nbsp;&nbsp;(" + moment().format("M/DD/YYYY") + ")";
                //document.getElementById("currentWeatherIcon").src = "http://openweathermap.org/img/wn/" + data.weather[0].icon + ".png";
                //document.getElementById("temperature").innerHTML = data.main.temp + " F";
                //document.getElementById("humidity").innerHTML = data.main.temp + " %";
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error){
        alert(error);
    });
}

// Search City after the Search button is clicked
var searchCity = function(){
    if (!searchCityInputEl.value){
        return;
    }

    //capitalize the first letter
    var cityName = searchCityInputEl.value.toLowerCase().trim();
    cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);

    //get current weather (APi call)
    getCurrentWeather(cityName);

    get5daysWeather(cityName);

    //add city to the list and save to local storage
    if (!selectedCitiesAr.includes(cityName))
    {
        addCityToList(cityName);
        addNewCityToLocalStorage(cityName);
    }

    searchCityInputEl.value = "";
}

//Search City Weater when clicked on the city from the list
var selectCityFromList = function(event){
    var targetEl = event.target;
    var cityName = event.target.getAttribute("data-city");
    getCurrentWeather(cityName);
    get5daysWeather(cityName);
}

selectedCitiesEl.addEventListener("click", selectCityFromList);

readCitiesList();

