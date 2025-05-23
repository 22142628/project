from django.db import models

class TrailSubmission(models.Model):
    trail_name = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    gps = models.CharField(max_length=100, blank=True)
    start_end = models.CharField(max_length=200, blank=True)
    distance = models.DecimalField(max_digits=5, decimal_places=2)
    elevation = models.PositiveIntegerField()
    difficulty = models.CharField(max_length=50)
    trail_type = models.CharField(max_length=50)
    estimated_time = models.DecimalField(max_digits=4, decimal_places=1)
    conditions = models.TextField(blank=True)
    accessibility = models.TextField(blank=True)
    hiker_biker = models.CharField(max_length=50)
    completed_as = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    photos = models.ImageField(upload_to='trail_photos/', blank=True, null=True)
    approval_status = models.CharField(
        max_length=20,
        choices=[('Pending', 'Pending'), ('Approved', 'Approved'), ('Rejected', 'Rejected')],
        default='Pending'
    )
    admin_comments = models.TextField(blank=True)  # ✅ New field
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.trail_name
