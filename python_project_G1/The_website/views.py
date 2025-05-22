from django.shortcuts import render
from django.shortcuts import HttpResponse
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            # Handle login
            pass
    else:
        form = AuthenticationForm()
    return render(request, 'user-login.html', {'form': form})

def register_view(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            # Handle registration
            pass
    else:
        form = UserCreationForm()
    return render(request, 'user-registration.html', {'form': form})
def home(request):
    return render(request, '/homepage.html')
def trail_submission(request):
    return render(request, 'trail-submission.html')
