
export const farmingData = {
  "introduction": "This dataset contains general information about farming practices in India, including common crops, soil types, and fertilizers. This information is intended for use by the AI chatbot to provide assistance when offline or when specific real-time data is not available.",
  "commonCrops": [
    {
      "name": "Rice (Paddy)",
      "regions": ["West Bengal", "Punjab", "Uttar Pradesh", "Andhra Pradesh", "Tamil Nadu"],
      "season": "Kharif (June-October)",
      "soil": "Clayey, Loamy soils with good water retention.",
      "notes": "Requires significant water. Varieties differ based on region."
    },
    {
      "name": "Wheat",
      "regions": ["Uttar Pradesh", "Punjab", "Haryana", "Madhya Pradesh", "Rajasthan"],
      "season": "Rabi (November-April)",
      "soil": "Well-drained loamy and clayey soils.",
      "notes": "A staple food crop in North India."
    },
    {
      "name": "Millets (Jowar, Bajra, Ragi)",
      "regions": ["Rajasthan", "Maharashtra", "Karnataka", "Andhra Pradesh"],
      "season": "Kharif",
      "soil": "Can grow in less fertile and sandy soils.",
      "notes": "Drought-resistant and suitable for arid regions."
    },
    {
      "name": "Sugarcane",
      "regions": ["Uttar Pradesh", "Maharashtra", "Karnataka", "Tamil Nadu"],
      "season": "Annual crop (takes 10-18 months)",
      "soil": "Well-drained loamy soils.",
      "notes": "Water-intensive cash crop."
    },
    {
      "name": "Cotton",
      "regions": ["Gujarat", "Maharashtra", "Telangana", "Andhra Pradesh"],
      "season": "Kharif",
      "soil": "Well-drained deep black soils (regur).",
      "notes": "Major cash crop, known as 'white gold'."
    }
  ],
  "soilTypes": [
    {
      "type": "Alluvial Soil",
      "regions": ["Indo-Gangetic plains", "coastal plains"],
      "characteristics": "Rich in humus, potash, phosphoric acid, and lime. Highly fertile.",
      "suitableCrops": ["Rice", "Wheat", "Sugarcane", "Cotton", "Jute"]
    },
    {
      "type": "Black Soil (Regur)",
      "regions": ["Deccan plateau (Maharashtra, Madhya Pradesh, Gujarat)"],
      "characteristics": "High clay content, retains moisture. Rich in lime, iron, magnesia, and alumina.",
      "suitableCrops": ["Cotton", "Sugarcane", "Jowar", "Tobacco", "Wheat"]
    },
    {
      "type": "Red and Yellow Soil",
      "regions": ["Eastern and Southern parts of Deccan plateau"],
      "characteristics": "Develops on crystalline igneous rocks. Porous, friable structure. Low in nitrogen, phosphorus, and humus.",
      "suitableCrops": ["Wheat", "Rice", "Millets", "Pulses"]
    },
    {
      "type": "Laterite Soil",
      "regions": ["Karnataka, Kerala, Tamil Nadu, Madhya Pradesh, hilly areas of Odisha and Assam"],
      "characteristics": "Rich in iron and aluminum, poor in nitrogen, phosphate, and potash. Acidic.",
      "suitableCrops": ["Tea", "Coffee", "Rubber", "Cashew"]
    }
  ],
  "fertilizers": [
    {
      "name": "Urea",
      "type": "Nitrogenous",
      "composition": "46% Nitrogen",
      "use": "Provides nitrogen, essential for leafy growth and green color. Applied during the main growth period."
    },
    {
      "name": "Di-Ammonium Phosphate (DAP)",
      "type": "Phosphatic",
      "composition": "18% Nitrogen, 46% Phosphorus",
      "use": "Excellent source of phosphorus for root development. Used at the time of sowing."
    },
    {
      "name": "Muriate of Potash (MOP)",
      "type": "Potassic",
      "composition": "60% Potassium",
      "use": "Improves plant's resistance to diseases and pests, and increases water use efficiency."
    },
    {
      "name": "Neem Coated Urea",
      "type": "Slow-release Nitrogenous",
      "composition": "Urea coated with neem oil",
      "use": "Slows down the release of nitrogen, reducing nutrient loss and improving nitrogen use efficiency."
    }
  ],
  "generalAdvice": "Always perform a soil test before applying fertilizers to understand the specific nutrient requirements of your field. Crop rotation is a good practice to maintain soil fertility and reduce pest and disease cycles. Consult with local agricultural extension services for region-specific advice."
}
