// Select elements
const chatBox = document.getElementById("chat-box");
const userInputField = document.getElementById("user-input-field");
const sendButton = document.getElementById("send-button");

// Global Cuisines List
const cuisines = {
  italian: ["Pizza Margherita", "Lasagna", "Spaghetti Carbonara", "Risotto", "Focaccia"],
  spanish: ["Paella", "Tortilla Española", "Gazpacho", "Churros", "Croquetas"],
  chinese: ["Dim Sum", "Kung Pao Chicken", "Sweet and Sour Pork", "Fried Rice", "Spring Rolls"],
  indian: ["Butter Chicken", "Biryani", "Palak Paneer", "Chole Bhature", "Samosas"],
  mexican: ["Tacos", "Enchiladas", "Quesadilla", "Guacamole", "Churros"],
  japanese: ["Sushi", "Ramen", "Tempura", "Sashimi", "Okonomiyaki"],
  french: ["Croissants", "Escargot", "Coq au Vin", "Bouillabaisse", "Crêpes"],
  greek: ["Moussaka", "Souvlaki", "Gyro", "Spanakopita", "Baklava"],
  korean: ["Bibimbap", "Kimchi", "Samgyeopsal", "Tteokbokki", "Bulgogi"],
  thai: ["Pad Thai", "Tom Yum", "Green Curry", "Som Tum", "Mango Sticky Rice"]
};

// Global Variables for Order Handling
let selectedCuisine = "";
let selectedDish = "";
let selectedDrink = "";
let selectedDrinkOption = "";
let waitingForDrink = false;
let orderCompleted = false;

// Start the conversation with a greeting
function startChat() {
  addMessage("Welcome to Podar Restaurant! 😊 What type of cuisine would you like to explore today? (e.g., Italian, Spanish, Chinese, Indian, etc.)");
}

// Add messages to the chatbox
function addMessage(message, sender = "bot") {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add(sender === "bot" ? "bot-message" : "user-message");
  messageDiv.innerHTML = message;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the latest message
}

// Handle user input and make responses
function handleUserInput() {
  const userMessage = userInputField.value;
  if (userMessage.trim()) {
    addMessage(userMessage, "user"); // Add user message to chat
    userInputField.value = ""; // Clear input field

    // Process user message
    processUserMessage(userMessage.toLowerCase());
  }
}

// Process the message based on user input
function processUserMessage(message) {
  if (message.toLowerCase() === "hey" && orderCompleted) {
    // Reset the order and start fresh
    resetOrder();
    addMessage("Great! Let's start a new order. 😊", "bot");
    addMessage("What type of cuisine would you like to explore today? (e.g., Italian, Spanish, Chinese, Indian, etc.)", "bot");
    return;
  }

  if (!selectedCuisine) {
    // Check if the message includes a recognized cuisine
    let cuisineFound = false;
    Object.keys(cuisines).forEach(cuisine => {
      if (message.includes(cuisine)) {
        selectedCuisine = cuisine; // Store the selected cuisine
        suggestDishes(cuisine);
        cuisineFound = true;
      }
    });

    if (!cuisineFound) {
      addMessage("Sorry, I didn't understand. Please choose a cuisine like Italian, Spanish, Chinese, Indian, etc.", "bot");
    }
  } else if (!waitingForDrink) {
    // If cuisine is selected and no drink is being requested, check for a dish
    handleDishSelection(message);
  } else {
    // If waiting for a drink, handle the drink selection
    handleDrinkSelection(message);
  }
}

// Suggest dishes based on cuisine
function suggestDishes(cuisine) {
  addMessage(`Great choice! Here are some popular dishes from ${cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}:`);
  cuisines[cuisine].forEach(dish => {
    addMessage(`${dish} - A delicious dish you must try!`, "bot");
  });
  addMessage("What would you like to order?", "bot");
}

// Handle user selection of a dish
function handleDishSelection(message) {
  // Check if the user mentioned a dish from the selected cuisine
  const dishFound = cuisines[selectedCuisine].find(dish => message.toLowerCase().includes(dish.toLowerCase()));

  if (dishFound) {
    selectedDish = dishFound; // Store the selected dish
    addMessage(`Great choice! You've selected ${selectedDish}. Would you like anything to drink with that? (e.g., Soda, Juice, Water)`, "bot");
    waitingForDrink = true; // Set flag to indicate we're waiting for a drink
  } else {
    addMessage("Sorry, I didn't catch that. Could you please choose a dish from the list?", "bot");
  }
}

// Handle drink selection
function handleDrinkSelection(message) {
  const drinks = ["soda", "juice", "water", "coffee", "tea", "wine"];
  const drinkFound = drinks.find(drink => message.toLowerCase().includes(drink));

  if (drinkFound) {
    selectedDrink = drinkFound; // Store the selected drink
    addMessage(`You have chosen ${selectedDrink}. Your order will be prepared shortly! 😊`, "bot");
    concludeOrder();  // Conclude the order after the drink selection
  } else {
    addMessage("Would you like a drink? You can choose from Soda, Juice, Water, Coffee, Tea, or Wine.", "bot");
  }
}

// Conclude the order and ask if they want to order more
function concludeOrder() {
  addMessage(`Thank you for your order of ${selectedDish} with ${selectedDrink}! Your meal will be prepared shortly. 😊`, "bot");
  addMessage("Say 'Hey' to start a new order! 😊", "bot");
  orderCompleted = true; // Order is complete
  selectedCuisine = "";
  selectedDish = "";
  selectedDrink = "";
  waitingForDrink = false;
}

// Reset the order variables for starting over
function resetOrder() {
  selectedCuisine = "";
  selectedDish = "";
  selectedDrink = "";
  waitingForDrink = false;
  orderCompleted = false;
}

// Event listener for the "Send" button
sendButton.addEventListener("click", handleUserInput);

// Event listener for the "Enter" key to submit message
userInputField.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleUserInput();
  }
});

// Start the chatbot with a greeting message
startChat();
