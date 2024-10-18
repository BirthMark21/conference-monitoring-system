from email.headerregistry import Group
from django.db import models
from django.forms import ValidationError
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin 
from django.db.models.signals import post_save
from django.contrib.auth.models import AbstractUser, Group, Permission

from django.db import models


class Event(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    registration_start_date = models.DateTimeField()
    registration_end_date = models.DateTimeField()
    location = models.CharField(max_length=100)
    address = models.CharField(max_length=100)
    available_seat = models.IntegerField()

    speakers = models.ManyToManyField(
        'Speaker', related_name='events_speaking', blank=True)

    sponsors = models.ManyToManyField(
        'Sponsor', related_name='events_sponsor', blank=True)

    attendees = models.ManyToManyField(
        'Attendee', related_name='events_attending', blank=True)

    schedules = models.ManyToManyField(
        'Schedule', related_name='events_scheduled', blank=True)
    
    roomids = models.ManyToManyField(
        'RoomId', related_name='events_roomid', blank=True
    )
    

    def __str__(self):
        return self.title

    @property
    def status(self):
        if self.end_date < timezone.now():
            return 'passed'
        else:
            return 'upcoming'

class Attendee(models.Model):
    fullname = models.CharField(max_length=255)
    phone = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    
    

    def __str__(self):
        return self.fullname






class Speaker(models.Model):
    ROLE_CHOICES = [
        ('PLENARY', 'Plenary Speaker'),
        ('INDUSTRY', 'Industry Speaker'),
        ('ACADEMIC', 'Academic Speaker'),
        ('INVITED', 'Invited Speaker'),
        ('LIGHT_TALKING', 'Light Talking Speaker'),
    ]

    STATUS_CHOICES = [
        ('FREE', 'Free'),
        ('BUSY', 'Busy'),
    ]

    fullname = models.CharField(max_length=255)
    organization = models.CharField(max_length=255)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES , blank=True , null=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, blank=True, null=True)
    bio = models.TextField(null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    image = models.ImageField(upload_to='speaker_images/', null=True, blank=True)
    expertise = models.TextField(null=True, blank=True)  # New expertise field

    def __str__(self):
        return self.fullname



   



class Sponsor(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    packages = models.CharField(max_length=255 , blank= False , null = False , default= "Gold-Inkind"  )
    logo = models.ImageField(upload_to='sponsor_logos/', null=True, blank=True)
    website = models.URLField(null=True, blank=True)
    contact_email = models.EmailField(null=True, blank=True)
    contact_phone = models.CharField(max_length=15, null=True, blank=True)
    agreement_signed = models.BooleanField(
        default=False, 
        verbose_name="Agreement_level"
    )

    def __str__(self):
        return self.name

    



class Schedule(models.Model):
    event_schedule = models.ForeignKey(Event, related_name='events_schedules', on_delete=models.CASCADE , blank=True,null=True)
    date = models.DateField()  # Date of the activity
    start_time = models.TimeField()  # Start time of the activity
    end_time = models.TimeField()  # End time of the activity
    title = models.CharField(max_length=200 , blank=True , null=True)  # Title of the activity
    activity = models.TextField()  # Short description or name of the activity
    description = models.TextField(blank=True, null=True)  # Detailed description of the activity
    moderator = models.CharField(max_length=200, blank=True, null=True)  # Moderator's name
    location = models.CharField(max_length=200, blank=True, null=True)  # Location of the activity
    format = models.CharField(max_length=200, blank=True, null=True)  # Format of the activity (e.g., Keynote, Panel)
    objectives = models.TextField(blank=True, null=True)  # Objectives or goals of the activity
    notes = models.TextField(blank=True, null=True)  # Additional notes or comments


    class Meta:
        ordering = ['date', 'start_time']  # Orders schedules by date and start time

    def __str__(self):
        return f"{self.title} ({self.date} {self.start_time} - {self.end_time})"
    def __str__(self):
        return self.activity
    
class RoomId(models.Model):
    roomId = models.CharField(max_length=255, ) 

    def __str__(self):
        return self.roomId


class Videos(models.Model):
    event_content_rec = models.ForeignKey(Event, related_name='event_content_recording', on_delete=models.CASCADE, blank=True, null=True)
    video = models.FileField(upload_to="videos/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.event_content_rec:
            return f"{self.event_content_rec.title} - {self.video}"
        return str(self.video)





from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models
from django.utils import timezone

class CustomUserManager(BaseUserManager):
    def create_user(self, username, fullname, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(username=username, fullname=fullname, email=email, **extra_fields)
        if password:
            user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, fullname, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(username, fullname, email, password, **extra_fields)

class EventUser(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('speaker', 'Speaker'),
        ('sponsor', 'Sponsor'),
        ('attendee', 'Attendee'),
        ('exhibitor', 'Exhibitor'),
        ('admin', 'Admin'),
        ('event_organizer', 'Event Organizer'),
        ('reviewer', 'Reviewer'),
    ]

    SEX_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]

    username = models.CharField(max_length=150, unique=True, null=True, blank=True)
    fullname = models.CharField(max_length=255, default='Anonymous')
    email = models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=128, null=True, blank=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    sex = models.CharField(max_length=10, choices=SEX_CHOICES, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['fullname', 'email']

    def __str__(self):
        return self.username

    class Meta:
        db_table = 'event_users'
        default_related_name = 'event_user'
        permissions = (  
            ("view_user", "Can view user"),
            ("add_speaker", "Can add speaker"),
            ("add_sponsor", "Can add sponsor"),
            ("change_event", "Can edit event"),
            ("delete_event", "Can delete event"),
            ("change_user", "Can edit user"),
            ("delete_user", "Can delete user"),
            ("add_admin", "Can add admin"),
        )

    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        related_name='customuser_groups',
        related_query_name='customuser_group',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        related_name='customuser_permissions',
        related_query_name='customuser_permission',
        help_text='Specific permissions for this user.',
    )


# new model from misganw
class Venue(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=200)
    description = models.TextField()
    capacity = models.IntegerField(default=100)  # Maximum capacity of the venue
    facilities =models.TextField(default= None)  # Structured field for facilities available
    number_of_rooms = models.IntegerField(default=1)  # Number of rooms in the venue
    is_accessible = models.BooleanField(default=True)  # Wheelchair accessible or not
    parking = models.BooleanField(default=False)  # Indicates if parking is available
    contact_person_name = models.CharField(max_length=255)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=15)
    package_deals = models.TextField(blank=True, null=True)  # Details of special package deals
    nearby_accommodations = models.BooleanField(default=False)  # Indicates if there are nearby accommodations
    image = models.ImageField(upload_to='venue_images/', null=True, blank=True)  # Image of the venue
    discount = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)  # Discount offered
    rent_price = models.DecimalField(max_digits=10, decimal_places=2 , blank=True, null=True)  # Rent price of the venue
    country = models.CharField(max_length=100 , blank=True, null =True)  # Country of the venue

    def __str__(self):
        return self.name



class PhysicalEvent(models.Model):
    CONFERENCE = 'Conference'
    WORKSHOP = 'Workshop'
    SEMINAR = 'Seminar'
    MEETUP = 'Meetup'
    LECTURE = 'Lecture'
    TRAINING = 'Training'
    NETWORKING = 'Networking'
    EXHIBITION = 'Exhibition'
    COMPETITION = 'Competition'
    WEBINAR = 'Webinar'
    PARTY = 'Party'
    FESTIVAL = 'Festival'
    CONCERT = 'Concert'
    TRADESHOW = 'Trade Show'
    LAUNCH_EVENT = 'Launch Event'
    SOCIAL_EVENT = 'Social Event'
    SPORTS_EVENT = 'Sports Event'
    CHARITY_EVENT = 'Charity Event'
    FUNDRAISER = 'Fundraiser'
    PANEL_DISCUSSION = 'Panel Discussion'
    VIRTUAL_EVENT = 'Virtual Event'
    GALA = 'Gala'
    RETREAT = 'Retreat'

    EVENT_TYPE_CHOICES = [
        (CONFERENCE, 'Conference'),
        (WORKSHOP, 'Workshop'),
        (SEMINAR, 'Seminar'),
        (MEETUP, 'Meetup'),
        (LECTURE, 'Lecture'),
        (TRAINING, 'Training'),
        (NETWORKING, 'Networking'),
        (EXHIBITION, 'Exhibition'),
        (COMPETITION, 'Competition'),
        (WEBINAR, 'Webinar'),
        (PARTY, 'Party'),
        (FESTIVAL, 'Festival'),
        (CONCERT, 'Concert'),
        (TRADESHOW, 'Trade Show'),
        (LAUNCH_EVENT, 'Launch Event'),
        (SOCIAL_EVENT, 'Social Event'),
        (SPORTS_EVENT, 'Sports Event'),
        (CHARITY_EVENT, 'Charity Event'),
        (FUNDRAISER, 'Fundraiser'),
        (PANEL_DISCUSSION, 'Panel Discussion'),
        (VIRTUAL_EVENT, 'Virtual Event'),
        (GALA, 'Gala'),
        (RETREAT, 'Retreat'),  
    ]

    SCHEDULED = 'Scheduled'
    POSTPONED = 'Postponed'
    CANCELLED = 'Cancelled'
    COMPLETED = 'Completed'

    EVENT_STATUS_CHOICES = [
        (SCHEDULED, 'Scheduled'),
        (POSTPONED, 'Postponed'),
        (CANCELLED, 'Cancelled'),
        (COMPLETED, 'Completed'),
    ]

    name = models.CharField(max_length=100, null=False, blank=False)
    speakers = models.ManyToManyField('Speaker', related_name='events', blank=True)
    sponsors = models.ManyToManyField('Sponsor', related_name='events', blank=True)
    event_venues = models.ManyToManyField('Venue', related_name='event_venues_choice',  blank=True, null=True)
    description = models.TextField(null=True, blank=True)
    banner_image = models.ImageField(upload_to='physical_event_banners/', null=True, blank=True)
    date = models.DateTimeField()
    location = models.CharField(max_length=200, null=False, blank=False)
    registration_start_date = models.DateTimeField(blank=True, null=True)
    registration_end_date = models.DateTimeField(blank=False, null=True)
    registration_fee = models.DecimalField(max_digits=10, decimal_places=2)
    available_seat = models.IntegerField(blank=True, null=True)
    event_type = models.CharField(max_length=20, choices=EVENT_TYPE_CHOICES, default=CONFERENCE)
    organizer_name = models.ForeignKey('EventUser', related_name='event_organizers', on_delete=models.CASCADE, blank=True, null=True)
    event_status = models.CharField(max_length=20, choices=EVENT_STATUS_CHOICES, default=SCHEDULED)

    def __str__(self):
        return self.name










class Content(models.Model):
    class ContentType(models.TextChoices):
        PDF = 'PDF', 'PDF Document'
        PPT = 'PPT', 'PowerPoint Presentation'
        MP3 = 'MP3', 'MP3 Audio'
        MP4 = 'MP4', 'MP4 Video'
        DOC = 'DOC', 'Word Document'
        TXT = 'TXT', 'Text File'
        IMAGE = 'IMG', 'Image'

    title = models.CharField(max_length=150)
    contents_events = models.ForeignKey('PhysicalEvent', related_name='content_events', on_delete=models.CASCADE, blank=True, null=True)
    image = models.ImageField(upload_to='content_images/', null=True, blank=True)
    document = models.FileField(upload_to='contact_file/', null=True, blank=True)
    description = models.TextField()
    tag = models.CharField(max_length=50)
    reference_urls= models.URLField(max_length=200, null=True, blank=True)
    content_type = models.CharField(max_length=3, choices=ContentType.choices, default=ContentType.PDF)
    rating = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return self.title





class Agenda(models.Model):
    title = models.CharField(max_length=150)
    events = models.ForeignKey(
        'PhysicalEvent',
        related_name='agenda_events',
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )
    Speakers_agnda = models.ForeignKey(
        'Speaker',
        on_delete=models.CASCADE,
        related_name='speakers_agnda',
        blank=True,
        null=True
    )
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    description = models.TextField()
    event_order = models.PositiveIntegerField()
    moderator = models.CharField(max_length=200, blank=True, null=True)
    image = models.ImageField(upload_to='agenda_images/', null=True, blank=True)


 
class Session(models.Model):
    event_sessions = models.ForeignKey(PhysicalEvent, related_name='events_sessions', on_delete=models.CASCADE, blank=True, null=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    speakers = models.ManyToManyField(Speaker, related_name='speakers_sessions', blank=True)
    moderator = models.CharField(max_length=200, blank=True, null=True)
    start_time = models.TimeField()
    end_time = models.TimeField()
    duration = models.DurationField(blank=True, null=True)
    location = models.CharField(max_length=200, blank=True, null=True)
    format = models.CharField(max_length=200, blank=True, null=True)
    objectives = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='sessions_images/', null=True, blank=True)

    class Meta:
        ordering = ['start_time']

    def __str__(self):
        return self.title



class Sponsorship(models.Model):
    GOLD_FINANCIAL = 'Gold - Financial'
    SILVER_FINANCIAL = 'Silver - Financial'
    BRONZE_FINANCIAL = 'Bronze - Financial'
    PLATINUM_FINANCIAL = 'Platinum - Financial'
    DIAMOND_FINANCIAL = 'Diamond - Financial'
    
    GOLD_IN_KIND = 'Gold - In-kind'
    SILVER_IN_KIND = 'Silver - In-kind'
    BRONZE_IN_KIND = 'Bronze - In-kind'
    PLATINUM_IN_KIND = 'Platinum - In-kind'
    DIAMOND_IN_KIND = 'Diamond - In-kind'

    SPONSORSHIP_CHOICES = [
        (GOLD_FINANCIAL, 'Gold - Financial'),
        (SILVER_FINANCIAL, 'Silver - Financial'),
        (BRONZE_FINANCIAL, 'Bronze - Financial'),
        (PLATINUM_FINANCIAL, 'Platinum - Financial'),
        (DIAMOND_FINANCIAL, 'Diamond - Financial'),
        (GOLD_IN_KIND, 'Gold - In-kind'),
        (SILVER_IN_KIND, 'Silver - In-kind'),
        (BRONZE_IN_KIND, 'Bronze - In-kind'),
        (PLATINUM_IN_KIND, 'Platinum - In-kind'),
        (DIAMOND_IN_KIND, 'Diamond - In-kind'),
    ]

    sponsorship_type_and_level = models.CharField(
        max_length=50, 
        choices=SPONSORSHIP_CHOICES, 
        verbose_name="Sponsorship Type and Level" , blank= True , null=True
    )
    fee = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        verbose_name="Amount Paid", 
        help_text="Enter the amount paid for the sponsorship." , null=True , blank=True 
    )
    agreement_signed = models.BooleanField(
        default=False, 
        verbose_name="Agreement Signed"
    )
    start_date = models.DateField(
        null=True, 
        blank=True, 
        verbose_name="Start Date"
    )
    end_date = models.DateField(
        null=True, 
        blank=True, 
        verbose_name="End Date"
    )
    image = models.ImageField(
        upload_to='sponsorship_images/', 
        null=True, 
        blank=True, 
        verbose_name="Sponsorship Image"
    )
    sponsor = models.ForeignKey(
        'Sponsor', 
        on_delete=models.CASCADE, 
        related_name='sponsorships', 
        verbose_name="Sponsor" , blank= True , null = True
    )

    class Meta:
        verbose_name = "Sponsorship"
        verbose_name_plural = "Sponsorships"
        indexes = [
            models.Index(fields=['sponsorship_type_and_level']),
            models.Index(fields=['start_date']),
        ]

    def __str__(self):
        return f"{self.sponsor.name} - {self.sponsorship_type_and_level}"

    def clean(self):
        if self.end_date and self.start_date and self.end_date < self.start_date:
            raise ValidationError("End date cannot be before start date.")
        if self.amount_paid < 0:
            raise ValidationError("Amount paid cannot be negative.")

# Gold - Financial:

# Logo placement on event website.
# Social media mention of the sponsor's brand.
# Recognition in event email newsletters.
# Complimentary tickets to the event.
# Dedicated booth space at the event.
# Silver - Financial:

# Logo placement on event website.
# Recognition in event email newsletters.
# Complimentary tickets to the event.
# Shared booth space at the event.
# Mention in event press releases.
# Bronze - Financial:

# Logo placement on event website.
# Recognition in event email newsletters.
# Complimentary tickets to the event.
# Shared booth space at the event.
# Platinum - Financial:

# Prime logo placement on event website.
# Social media spotlight of the sponsor's brand.
# Featured mention in event email newsletters.
# VIP access to event activities.
# Exclusive booth space at the event.
# Diamond - Financial:

# Exclusive logo placement on event website.
# Social media feature of the sponsor's brand.
# Premier mention in event email newsletters.
# VIP access to event activities.
# Exclusive booth space at the event.
# Speaking opportunity at the event.
# Custom - Financial:

# Tailored benefits based on negotiated terms.
# Customized marketing and branding opportunities.
# Flexibility in choosing event involvement options.
# Personalized recognition during the event.
# In-kind Sponsorship Packages:
# Gold - In-kind:

# Product placement in event promotional materials.
# Inclusion of sponsor's products in event giveaways.
# Recognition on event signage and banners.
# Opportunity to provide branded merchandise to event attendees.
# Silver - In-kind:

# Product placement in event promotional materials.
# Inclusion of sponsor's products in event giveaways.
# Recognition on event signage and banners.
# Opportunity to provide branded merchandise to event attendees.
# Bronze - In-kind:

# Product placement in event promotional materials.
# Inclusion of sponsor's products in event giveaways.
# Recognition on event signage and banners.
# Platinum - In-kind:

# Exclusive product placement in event promotional materials.
# Premium inclusion of sponsor's products in event giveaways.
# Prominent recognition on event signage and banners.
# VIP access to event activities.
# Diamond - In-kind:

# Premier product placement in event promotional materials.
# Exclusive inclusion of sponsor's products in event giveaways.
# Prominent recognition on event signage and banners.
# VIP access to event activities.
# Speaking opportunity at the event.
# Custom - In-kind:

# Tailored product placement and recognition opportunities.
# Flexibility in choosing product integration options.
# Customized branding and marketing strategies.
# Personalized engagement with event attendees.

class Feedback(models.Model):
    
    session = models.ForeignKey(Session, on_delete=models.CASCADE)
    rating = models.IntegerField() 
    interests = models.TextField() # Rating out of 5 or any other scale
    comment = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)  # Timestamp indicating when the feedback was submitted
    helpful_count = models.PositiveIntegerField(default=0)  # Count of how many attendees found this feedback helpful
    flagged = models.BooleanField(default=False)  # Indicates whether the feedback has been flagged for review
class Reviewer(models.Model):
    STATUS_CHOICES = [
        ('free', 'Free'),
        ('busy', 'Busy'),
    ]

    name = models.CharField(max_length=255)
    email = models.EmailField(null=True, blank=True)
    phone_number = models.CharField(max_length=15 , blank=True, null=True)
    expertise = models.CharField(max_length=100)
    rating = models.FloatField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='free')
    total_reviews_completed = models.PositiveIntegerField(default=0)
    banner = models.ImageField(upload_to='reviewer_profile/', null=True, blank=True)  # Profile picture
    affiliation = models.CharField(max_length=255, blank=True, null=True)

    def calculate_average_rating(self):
        total_reviews = self.total_reviews_completed
        if total_reviews == 0:
            return 0
        total_rating = self.review_set.aggregate(models.Sum('rating'))['rating__sum']
        return total_rating / total_reviews

    def get_assigned_abstracts(self):
        return Abstract.objects.filter(reviewer=self)

    def __str__(self):
        return self.name




class Abstract(models.Model):
    STATUS_CHOICES = [
        ('submitted', 'Submitted'),
        ('under_review', 'Under Review'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('awaiting_full_submission', 'Awaiting Full Submission'),
    ]

    FILE_TYPE_CHOICES = [
        ('pdf', 'PDF'),
        ('doc', 'DOC'),
        ('jpeg', 'JPEG'),
        ('png', 'PNG'),
        ('mp4', 'MP4'),
        ('txt', 'Txt')
    ]
    
    author = models.CharField(max_length=255)
    title = models.CharField(max_length=100)
    content_text = models.TextField(blank=True)
    reviewer = models.ForeignKey(Reviewer, on_delete=models.CASCADE, null=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='submitted')
    document = models.FileField(upload_to='abstracts/', null=True, blank=True)  # Abstract's document
    abstract_image = models.ImageField(upload_to='abstract_images/', null=True, blank=True)  # Abstract image
    content_type = models.CharField(max_length=4, choices=FILE_TYPE_CHOICES, default='text')

    def change_status(self, new_status):
        self.status = new_status
        self.save()

    def __str__(self):
        return self.title


class Review(models.Model):
   

   
    abstract = models.ForeignKey(Abstract, on_delete=models.CASCADE, null=True, blank=True)
    reviewer = models.ForeignKey(Reviewer, on_delete=models.CASCADE, null=True)
    comments = models.TextField()
    rating = models.IntegerField()
    reviewed_at = models.DateTimeField(auto_now_add=True)
    deadline = models.DateTimeField( blank=True, null=True)  # New field for review deadline
    feedback = models.TextField(blank=True)
    clarity_and_coherence = models.PositiveSmallIntegerField(default=0)
    relevance = models.PositiveSmallIntegerField(default=0)
    originality_and_innovation = models.PositiveSmallIntegerField(default=0)
    methodology = models.PositiveSmallIntegerField(default=0)
    significance = models.PositiveSmallIntegerField(default=0)
    conclusions = models.PositiveSmallIntegerField(default=0)
    accuracy_and_validity = models.PositiveSmallIntegerField(default=0)
    conciseness = models.PositiveSmallIntegerField(default=0)
    language_and_style = models.PositiveSmallIntegerField(default=0)

  

class Exhibitor(models.Model):
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15 , blank=True, null=True)
    description = models.TextField()
    address = models.CharField(max_length=255, null=True, blank=True)
    website = models.URLField(null=True, blank=True)
    social_media_link = models.URLField(null=True, blank=True)
    image = models.ImageField(upload_to='exhibitor_images/', null=True, blank=True)  # Image field for Exhibitor

    def __str__(self):
        return self.name



class ExhibitorBooth(models.Model):
    
    name = models.CharField(max_length=100, blank=True, null=True)  # New name field
    booth_number = models.PositiveIntegerField()  # Unique number identifying the booth
    is_occupied = models.BooleanField(default=False)  # Indicates whether the booth is currently occupied
    staff_count = models.PositiveIntegerField(default=1)  # Number of staff members assigned to the booth
    amenities = models.TextField(blank=True)  # Description of amenities available at the booth
    image = models.ImageField(upload_to='booth_images/', null=True, blank=True)  # Image of the booth
    location = models.CharField(max_length=100, blank=True, null=True)  # Specific location of the booth within the venue

    def __str__(self):
        return f"Booth {self.booth_number} for {self.exhibitor.name}"


class ShowcaseItem(models.Model):
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('sold', 'Sold'),
        ('on_process', 'On Process'),
        ('not_on_market', 'Not On Market')
    ]

    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity_available = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='available')
    sold_at = models.DateTimeField(blank=True, null=True)
    exhibitor_booth = models.ForeignKey(ExhibitorBooth, on_delete=models.CASCADE, related_name='showcase_items', null=True, blank=True)
    image = models.ImageField(upload_to='showcase_item_images/', null=True, blank=True)  # Image field for ShowcaseItem

    def sell_item(self):
        if self.status != 'sold':
            self.status = 'sold'
            self.sold_at = timezone.now()
            self.save()

    def mark_on_process(self):
        if self.status != 'on_process':
            self.status = 'on_process'
            self.save()

    def mark_not_on_market(self):
        if self.status != 'not_on_market':
            self.status = 'not_on_market'
            self.save()

    def __str__(self):
        if self.exhibitor_booth:
            return f"{self.name} - Booth {self.exhibitor_booth.name} for {self.exhibitor_booth.exhibitor.name}"
        else:
            return self.name






