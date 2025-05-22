from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('trail_submission/', views.trail_submission , name='trail-submission'),
     path('login/', views.login_view, name='user-login'),
    path('register/', views.register_view, name='user-registration'),
]