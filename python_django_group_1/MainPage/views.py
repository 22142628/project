from django.http import HttpResponse
from django.shortcuts import render

def homepage(request):
    return render(request, 'homepage.html')
def trail_submission(request):
    return render(request, 'trail-submission.html')
def user_login(request):
    return render(request, 'user-login.html')
def user_registration(request):
    return render(request, 'user-registration.html') 





    