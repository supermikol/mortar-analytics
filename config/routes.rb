Rails.application.routes.draw do

  root 'pages#index'

  get 'history/index' => 'pages#history'
  get 'modal' => 'pages#modal'
  get 'transaction/add' => 'pages#form'
  post 'transaction/add' => 'pages#create_entry'

  get 'stacked_chart' => 'pages#stacked_chart'
end
