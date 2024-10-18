from rest_framework import serializers
from .models import Abstract, Agenda, Content, Event, Attendee, Exhibitor, ExhibitorBooth, PhysicalEvent, Review, Reviewer, RoomId, Session, ShowcaseItem, Speaker, Sponsor, Schedule, Sponsorship, Venue, Videos
from django.contrib.auth import get_user_model
from .models import EventUser
from django.contrib.auth import authenticate
from rest_framework import serializers
from django.core.validators import RegexValidator
from .models import EventUser



class EventUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventUser
        fields = [
            'id', 'username', 'fullname', 'email', 'phone_number', 'password', 'profile_picture', 'role', 'sex'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True},
            'username': {'required': True},
            'fullname': {'required': True},
            'phone_number': {'required': True},
            'profile_picture': {'required': False, 'allow_null': True},
            'role': {'required': True},
            'sex': {'required': True}
        }

    def validate_email(self, value):
        if EventUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email is already in use.")
        return value

    def validate_username(self, value):
        if EventUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username is already in use.")
        return value

    def validate_role(self, value):
        allowed_roles = [role[0] for role in EventUser.ROLE_CHOICES]
        if value not in allowed_roles:
            raise serializers.ValidationError(f"Role must be one of {', '.join(allowed_roles)}.")
        return value

    def validate_sex(self, value):
        allowed_sexes = [sex[0] for sex in EventUser.SEX_CHOICES]
        if value not in allowed_sexes:
            raise serializers.ValidationError(f"Sex must be one of {', '.join(allowed_sexes)}.")
        return value

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        return value

    def create(self, validated_data):
        user = EventUser.objects.create_user(
            username=validated_data['username'],
            fullname=validated_data['fullname'],
            email=validated_data['email'],
            phone_number=validated_data['phone_number'],
            password=validated_data['password'],
            profile_picture=validated_data.get('profile_picture', None),
            role=validated_data['role'],
            sex=validated_data['sex']
        )
        return user


class EventUserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        
        if not username:
            raise serializers.ValidationError("Username is required.")
        
        if not password:
            raise serializers.ValidationError("Password is required.")
        
        user = authenticate(username=username, password=password)
        if user:
            if not user.is_active:
                raise serializers.ValidationError("User is not active.")
        else:
            raise serializers.ValidationError("Unable to log in with provided credentials.")
        
        data['user'] = user
        return data


# User = get_user_model()

# class EventUserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = EventUser
#         fields = ['id', 'username', 'fullname', 'email', 'password', 'is_staff', 'is_active']
#         # extra_kwargs = {'password': {'write_only': True}}

#     def create(self, validated_data):
#         user = EventUser.objects.create_user(**validated_data)
#         return user

# class EventUserLoginSerializer(serializers.Serializer):
#     username = serializers.CharField()
#     password = serializers.CharField()

#     def validate(self, data):
#         username = data.get('username')
#         password = data.get('password')
        
#         if username and password:
#             user = authenticate(username=username, password=password)
#             print(user)
#             if user:
#                 if user.is_active:
#                     data['user'] = user
#                 else:
#                     raise serializers.ValidationError("User is not active.")
#             else:
#                 raise serializers.ValidationError("Unable to log in with provided credentials.")
#         else:
#             raise serializers.ValidationError("Must provide username and password.")
#         return data
    
    
    
# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ('id', 'username', 'email', 'first_name', 'last_name')


class AttendeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendee
        fields = '__all__'


class SpeakerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Speaker
        fields = '__all__'


class SponsorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sponsor
        fields = '__all__'


class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = '__all__'
        
class RoomIdSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomId
        fields = '__all__'


class EventSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()

    speakers = SpeakerSerializer(many=True, read_only=True)
    sponsors = SponsorSerializer(many=True, read_only=True)
    attendees = AttendeeSerializer(many=True, read_only=True)
    schedules = ScheduleSerializer(many=True, read_only=True)
    roomids = RoomIdSerializer(many=True, read_only=True)

    start_date = serializers.DateTimeField(format="%Y-%m-%d %I:%M %p")
    end_date = serializers.DateTimeField(format="%Y-%m-%d %I:%M %p")
    registration_start_date = serializers.DateTimeField(
        format="%Y-%m-%d %I:%M %p")
    registration_end_date = serializers.DateTimeField(
        format="%Y-%m-%d %I:%M %p")

    def get_status(self, obj):
        return obj.status

    class Meta:
        model = Event
        fields = '__all__'
        

class AttendeeRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendee
        fields = ('fullname', 'phone', 'email')
        


class AttendeeLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    event_id = serializers.IntegerField()


class SpeakerRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Speaker
        fields = ('fullname', 'organization', 'role')


class SponsorRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sponsor
        fields = ('name', 'description')


class ScheduleRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ('date', 'start_time', "end_time", "activity")
        
class RoomIdRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomId
        fields = ('roomId',)
        
class VideoUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Videos
        fields = '__all__'



class PhysicalEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhysicalEvent
        fields = '__all__'


class PhysicalEventRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhysicalEvent
        fields =  '__all__'





class PhysicalEventUpdateSerializer(serializers.ModelSerializer):


    # speakers = SpeakerSerializer(many=True, read_only=True)
    # sponsors = SponsorSerializer(many=True, read_only=True)

    class Meta:
        model = PhysicalEvent
        fields = '__all__'

class VenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = '__all__'

class VenueRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = '__all__'




class VenueUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = '__all__'


# serializers.py



class AgendaSerializer(serializers.ModelSerializer):
    event_name = serializers.CharField(source='events.name', read_only=True)

    class Meta:
        model = Agenda
        fields = ('id', 'title', 'start_time', 'end_time', 'description', 'event_order', 'moderator', 'image', 'events', 'event_name')


class AgendaRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agenda
        fields = '__all__'



class ContentSerializer(serializers.ModelSerializer):
    event_name = serializers.SerializerMethodField()
    event_content_name = serializers.CharField(source='PhysicalEvent.name', read_only=True)

    class Meta:
        model = Content
        fields = '__all__'
    def get_event_name(self, obj):
        if obj.contents_events:
            return obj.contents_events.name  # Adjust the attribute name if necessary
        return None

class ContentRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Content
        fields = '__all__'





class SponsorshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sponsorship
        fields = '__all__'

    sponsor = SponsorSerializer(many=True, read_only=True)
    PhysicalEvents = PhysicalEventSerializer(many=True, read_only=True)

class SponsorshipRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sponsorship
        fields = '__all__'
    



# Reviewer Serializers
class ReviewerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reviewer
        fields = '__all__'

class ReviewerRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reviewer
        fields = '__all__'
        
# Abstract Serializers
class AbstractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Abstract
        fields = '__all__'

class AbstractRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Abstract
        fields = '__all__'
        




class ReviewSerializer(serializers.ModelSerializer):
    abstract_title = serializers.CharField(source='abstract.title', read_only=True)
    reviewer_name = serializers.CharField(source='reviewer.name', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'abstract', 'abstract_title', 'reviewer', 'reviewer_name', 'comments', 'rating', 
            'reviewed_at', 'deadline', 'feedback', 'clarity_and_coherence', 'relevance', 
            'originality_and_innovation', 'methodology', 'significance', 'conclusions', 
            'accuracy_and_validity', 'conciseness', 'language_and_style'
        ]

        

class ReviewRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'
            



#new serializers



class ExhibitorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exhibitor
        fields = '__all__'

class ExhibitorRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exhibitor
        fields = '__all__'

class ExhibitorUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exhibitor
        fields = '__all__'



class ExhibitorBoothSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExhibitorBooth
        fields = '__all__'

class ExhibitorBoothRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExhibitorBooth
        fields = '__all__'
      
class ExhibitorBoothUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExhibitorBooth
        fields = '__all__'

class ShowcaseItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShowcaseItem
        fields = '__all__'

class ShowcaseItemRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShowcaseItem
        fields = '__all__'

class ShowcaseItemUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShowcaseItem
        fields = '__all__'








class SessionSerializer(serializers.ModelSerializer):
    event_name = serializers.CharField(source='event_sessions.name', read_only=True)
   

    class Meta:
        model = Session
        fields = '__all__'






