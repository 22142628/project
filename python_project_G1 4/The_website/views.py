from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Q
from .models import TrailSubmission
from django.core.serializers.json import DjangoJSONEncoder  # ✅ Fix for Decimal
import json  # ✅ JSON serialization

# USER AUTH VIEWS

def user_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return redirect('trail-approval') if user.is_superuser else redirect('home')
        return render(request, 'user-login.html', {'error': 'Invalid credentials'})
    return render(request, 'user-login.html')


def register_view(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('user-login')
    else:
        form = UserCreationForm()
    return render(request, 'user-registration.html', {'form': form})


def logout_view(request):
    logout(request)
    return redirect('home')


# MAIN HOMEPAGE VIEW

def home(request):
    query = request.GET.get('q', '')
    trails = TrailSubmission.objects.filter(approval_status='Approved')

    # ✅ Fix: serialize with Decimal support
    trails_json = json.dumps(list(trails.values()), cls=DjangoJSONEncoder)

    if query:
        trails = trails.filter(
            Q(trail_name__icontains=query) |
            Q(location__icontains=query) |
            Q(notes__icontains=query)
        )
    return render(request, 'homepage.html', {
        'trails': trails,
        'query': query,
        'trails_json': trails_json
    })


# TRAIL SUBMISSION VIEW

@login_required
def trail_submission(request):
    if request.method == 'POST':
        try:
            distance = float(request.POST.get('distance'))
            elevation = float(request.POST.get('elevation'))
            estimated_time = float(request.POST.get('estimated_time'))
        except (ValueError, TypeError):
            messages.error(request, "Distance, elevation, and estimated time must be valid numbers.")
            return redirect('trail-submission')

        conditions = ", ".join(request.POST.getlist('conditions'))
        accessibility = ", ".join(request.POST.getlist('accessibility'))

        TrailSubmission.objects.create(
            trail_name=request.POST.get('trail_name'),
            location=request.POST.get('location'),
            gps=request.POST.get('gps'),
            start_end=request.POST.get('start_end'),
            distance=distance,
            elevation=elevation,
            difficulty=request.POST.get('difficulty'),
            trail_type=request.POST.get('trail_type'),
            estimated_time=estimated_time,
            hiker_biker=request.POST.get('hiker_biker'),
            completed_as=request.POST.get('completed_as'),
            conditions=conditions,
            accessibility=accessibility,
            description=request.POST.get('description'),
            notes=request.POST.get('notes'),
            approval_status='Pending',
            photos=request.FILES.get('photos')
        )
        return redirect('home')

    conditions_list = ["Muddy", "Rocky", "Icy", "Snowy", "Dry", "Wet", "Hilly", "Steep"]
    accessibility_list = ["Wheelchair Accessible", "Child-friendly", "Dog-friendly", "Permit Required"]

    return render(request, 'trail-submission.html', {
        'conditions': conditions_list,
        'accessibility': accessibility_list
    })


# TRAIL APPROVAL VIEW

@login_required
def trail_approval(request):
    if request.method == 'POST':
        trail_id = request.POST.get('trail_id')
        status = request.POST.get('approval_status')
        comments = request.POST.get('admin_comments', '')
        edited_description = request.POST.get('edited_data', '')

        trail = get_object_or_404(TrailSubmission, id=trail_id)

        if status == 'Rejected':
            trail.delete()
        elif status == 'Approved':
            trail.approval_status = 'Approved'
            trail.admin_comments = comments
            trail.description = edited_description
            trail.save()

        return redirect('trail-approval')

    submissions = TrailSubmission.objects.filter(approval_status='Pending').order_by('-submitted_at')
    return render(request, 'trail-approval.html', {'submissions': submissions})


# ADDITIONAL VIEWS

@login_required
def user_profile(request):
    return render(request, 'user-profile.html')


@login_required
def submit_rating(request):
    if request.method == 'POST':
        rating = request.POST.get('rating')
        print(f"User {request.user} submitted a rating: {rating}")
        messages.success(request, "Your rating has been submitted.")
    return redirect('home')


@login_required
def submit_comment(request):
    if request.method == 'POST':
        comment = request.POST.get('comment')
        print(f"User {request.user} commented: {comment}")
        messages.success(request, "Your comment has been posted.")
    return redirect('home')


@login_required
def dashboard(request):
    return render(request, 'dashboard.html')

trails = TrailSubmission.objects.filter(approval_status='Approved')
trails_json = json.dumps(list(trails.values()), cls=DjangoJSONEncoder)

