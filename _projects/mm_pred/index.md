---
layout: post
title: March Madness Prediction
published: true
order: 1
description: >
  A data‑science capstone from my final semester at Purdue University.  
  We built several classification models (Logistic Regression, SVM, KNN, Random Forest)
  to predict how many games Purdue would win in the 2024 NCAA Tournament, and evaluated
  them against both business and data‑science success criteria.
skills:
  - Exploratory Data Analysis
  - Feature Engineering
  - Dimensionality Reduction (PCA)
  - Classification Modeling
  - Model Evaluation & Selection
  - Data Visualization
main-image: /mm_cover.jpg
---

## 📖 Introduction

In this project, we explore historical NCAA data to predict Purdue’s 2024 Tournament performance.  
We walk through data preprocessing, dimensionality reduction, model training, and final probability outputs.

---

## 📂 Project Structure

```text
marchmadness-prediction/
├── data/           # CSVs for training, validation, final predictions & raw misc
├── notebooks/      # Jupyter notebooks with analysis & code
├── reports/        # Final PDF reports: evaluation & modeling
└── slides/         # Presentation decks
``` 

## 🔍 Data Overview
We split our data into:
- training_data.csv: used to train models
- val_data.csv: validation set for hyperparameter tuning
- final_predictions.csv: hold-out set predictions
- misc_data/: auxiliary datasets used in feature engineering

## 📊 2D & 3D PCA Visualizations
Dimensionality reduction helps us inspect variance structure and clustering by team metrics.

2D PCA
{% include image-gallery.html images="mm_2d_pca.png" height="400" %} 
<span style="font-size: 20px">2D PCA of team performance features</span>

3D PCA
{% include image-gallery.html images="mm_3d_pca.png" height="400" %} 
<span style="font-size: 20px">3D PCA of team performance features</span>

## 🌟 Top 10 Feature Importances (Random Forest)
We trained a Random Forest classifier and extracted the top 10 most influential features.

{% include image-gallery.html images="mm_feature_importance.png" height="400" %} 
<span style="font-size: 20px">Random Forest top 10 feature importances</span>

## 🏀 Predicted Win Probabilities
Finally, we generate predicted probabilities for each team in the hold-out tournament bracket.

{% include image-gallery.html images="mm_pred.png" height="800" %} 
<span style="font-size: 20px">Predicted win probability for each team</span>

## 📈 Performance Summary

Across both the initial and fine‑tuned parameter sets, Logistic Regression consistently led in overall classification metrics, while Random Forest was the only model to nail Purdue’s actual tournament outcome exactly.

| Model                   | Initial Accuracy | Tuned Accuracy |
|-------------------------|:----------------:|:--------------:|
| **Logistic Regression** | 0.5641           | 0.6667         |
| SVM                     | 0.4615           | 0.5385         |
| KNN                     | 0.4300           | 0.4839         |
| Random Forest           | 0.4146           | 0.4390         |  

*(Weighted macro‑average across accuracy, precision, recall, F1)* 

---

## ⚖️ Predicted vs. Actual Purdue Performance

| Model                   | Predicted Round       | Implied # Wins | Actual Round          | Actual # Wins |
|-------------------------|:---------------------:|:--------------:|:---------------------:|:-------------:|
| Logistic Regression     | Final Four (Semis)    | 4              | Championship (Final)  | 5             |
| SVM                     | Final Four (Semis)    | 4              | Championship (Final)  | 5             |
| KNN                     | Final Four (Semis)    | 4              | Championship (Final)  | 5             |
| **Random Forest**       | Championship Runner‑up| 5              | Championship (Final)  | 5             |

- Logistic, SVM, and KNN each fell one round short of Purdue’s actual runner‑up finish (Semis vs. Final) 
- Random Forest uniquely matched the true outcome, correctly predicting Purdue’s path to the championship game

---

## 🎯 Key Takeaways

1. **Business Success:**  
   All models met the “within 1‑round error” criterion, satisfying our primary objective

2. **Metric Trade‑Offs:**  
   Despite Random Forest’s perfect bracket prediction for Purdue, its overall accuracy (0.439) lagged behind simpler models—underscoring that the highest aggregate score doesn’t always align with specific business goals.  

3. **Feature Insights:**  
   Across models, seed and efficiency differentials (AdjEM, AdjDE) consistently ranked among the top predictors, reaffirming their domain importance.

---

## 🔮 Next Steps

- **Ensemble Stacking:** Blend Logistic Regression, SVM, and RF via a meta‑learner to leverage both high‑accuracy and bracket‑precision signals.  
- **Probability Calibration:** Apply Platt scaling or isotonic regression to improve alignment between predicted probabilities and observed frequencies.  
- **Game‑by‑Game Modeling:** Explore a sequential model that predicts each matchup individually—potentially boosting overall tournament‑level accuracy.  
- **Live Updating:** Integrate in‑season and in‑tournament feeds (injuries, momentum metrics) to dynamically adjust win probabilities round‑by‑round.

## 🔗 GitHub

You can explore the source code here:  
👉 [View on GitHub](https://github.com/itsSaul24/marchmadness-prediction)

---