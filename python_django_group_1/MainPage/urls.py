from django.urls import path
from MainPage import views

urlpatterns = [
    path('', views.homepage, name='homepage'),  
   path('trail-submission/', views.trail_submission, name='trail_submission'),
   path('user-login/', views.user_login, name='user-login'),
   path('user-registration/', views.user_registration, name='user-registration'),
]
