Rails.application.routes.draw do

  root 'pages#index'

  get 'history/index' => 'pages#history'
  get 'modal' => 'pages#modal'
  get 'transaction/add' => 'pages#form'
  get 'history/invoice/:id' => 'pages#display_invoice'
  post 'transaction/add' => 'pages#create_entry'

  get 'sum' => 'pages#sum'
end
