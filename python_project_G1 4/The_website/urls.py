from django.contrib import admin
from django.urls import path
from The_website import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('user-login/', views.user_login, name='user-login'),
    path('user-registration/', views.register_view, name='user-registration'),
    path('logout/', views.logout_view, name='logout'),
    path('trail-submission/', views.trail_submission, name='trail-submission'),
    path('trail-approval/', views.trail_approval, name='trail-approval'),
    path('profile/', views.user_profile, name='user-profile'),
    path('submit-rating/', views.submit_rating, name='submit-rating'),
    path('submit-comment/', views.submit_comment, name='submit-comment'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('search/', views.search_trails, name='search-trails'),
]
