Rails.application.routes.draw do

  root 'pages#index'

  get 'history/index' => 'pages#history'
  get 'modal' => 'pages#modal'

  get 'stacked_chart' => 'pages#stacked_chart'
end
