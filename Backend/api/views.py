# from datetime import timezone
from rest_framework import viewsets, status, generics
from .models import Agenda, Content, EventUser, Event, Attendee, PhysicalEvent, RoomId, Session, Speaker, Sponsor, Sponsorship, Venue, Videos
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView 
from rest_framework.response import Response
from .serializers import AgendaRegistrationSerializer, AgendaSerializer, ContentRegistrationSerializer, ContentSerializer, EventSerializer, AttendeeSerializer, AttendeeRegistrationSerializer, EventUserLoginSerializer, EventUserSerializer, PhysicalEventRegistrationSerializer, PhysicalEventSerializer, PhysicalEventUpdateSerializer, RoomIdRegistrationSerializer, RoomIdSerializer, SessionSerializer, SpeakerSerializer, SponsorSerializer, SpeakerRegistrationSerializer, SponsorRegistrationSerializer, ScheduleRegistrationSerializer, AttendeeLoginSerializer, SponsorshipRegistrationSerializer, SponsorshipSerializer, VenueRegistrationSerializer, VenueSerializer, VenueUpdateSerializer, VideoUploadSerializer
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import api_view

from rest_framework_simplejwt.tokens import RefreshToken

from reportlab.pdfgen import canvas
from django.http import HttpResponse
from io import BytesIO
from reportlab.lib.pagesizes import letter

from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.core.mail import send_mail
from datetime import datetime
import yagmail



def generate_attendees_pdf(event):
    buffer = BytesIO()
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="attendees.pdf"'

    c = canvas.Canvas(buffer)
    c.drawString(100, 750, "Event Attendees:")

    attendees = event.attendees.all()

    y = 730  # Initial y-position
    for attendee in attendees:
        y -= 20  # Adjust the y-position for the next entry
        c.drawString(100, y, f"{attendee.fullname} {attendee.phone}")

    c.showPage()
    c.save()

    pdf = buffer.getvalue()
    buffer.close()
    response.write(pdf)

    return response


def generate_event_report_pdf(event):
    buffer = BytesIO()
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="event_report.pdf'

    c = canvas.Canvas(buffer, pagesize=letter)

    # Set bold font
    c.setFont("Helvetica-Bold", 14)

    # Event Title
    c.drawCentredString(300, 700, "Event Report")

    # Set normal font
    c.setFont("Helvetica", 12)

    c.drawString(100, 680, f"Title: {event.title}")

    # Event Description
    c.drawString(100, 660, f"Description: {event.description}")

    # Event Address and Location
    c.drawString(100, 640, f"Address: {event.address}")
    c.drawString(100, 620, f"Location: {event.location}")

    # Event Duration (formatted date)
    start_date = event.start_date.strftime("%Y-%m-%d")
    end_date = event.end_date.strftime("%Y-%m-%d")
    event_duration = f"Duration: {start_date} - {end_date}"
    c.drawString(100, 600, event_duration)

    # Number of Participants
    num_participants = event.attendees.count()
    c.drawString(100, 580, f"Number of Participants: {num_participants}")

    # Event Speakers Header
    c.setFont("Helvetica-Bold", 12)
    c.drawString(100, 560, "Honoured Speakers:")

    # Set normal font
    c.setFont("Helvetica", 12)

    # Event Speakers (in a numbered list format)
    speakers = event.speakers.all()
    y_speakers = 540
    for i, speaker in enumerate(speakers, start=1):
        y_speakers -= 20
        c.drawString(100, y_speakers,
                     f"{i}. {speaker.fullname} - {speaker.organization}")

    # Event Sponsors Header
    c.setFont("Helvetica-Bold", 12)
    c.drawString(100, y_speakers - 20, "Honoured Sponsors")

    # Set normal font
    c.setFont("Helvetica", 12)

    # Event Sponsors (in a numbered list format)
    sponsors = event.sponsors.all()
    y_sponsors = y_speakers - 40  # Adjust the y-position for sponsors
    for i, sponsor in enumerate(sponsors, start=1):
        y_sponsors -= 20
        c.drawString(100, y_sponsors,
                     f"{i}. {sponsor.name} - {sponsor.description}")

    c.showPage()
    c.save()

    pdf = buffer.getvalue()
    buffer.close()
    response.write(pdf)

    return response


def generate_schedule_pdf(event):
    buffer = BytesIO()
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="event_schedule.pdf'

    c = canvas.Canvas(buffer)
    c.drawString(100, 750, "Event Schedule:")

    schedules = event.schedules.all().order_by('date', 'start_time')

    y = 730  # Initial y-position
    for schedule in schedules:
        y -= 20  # Adjust the y-position for the next entry
        display_text = f"{schedule.date} {schedule.start_time} - {schedule.end_time}: {schedule.activity}"
        c.drawString(100, y, display_text)

    c.showPage()
    c.save()

    pdf = buffer.getvalue()
    buffer.close()
    response.write(pdf)

    return response


class AttendeesPDFDownload(APIView):
    def get(self, request, event_id):
        # You need to fetch the event data
        event = Event.objects.get(pk=event_id)
        response = generate_attendees_pdf(event)
        return response


class EventReportPDFDownload(APIView):
    def get(self, request, event_id):
        # You need to fetch the event data
        event = Event.objects.get(pk=event_id)
        response = generate_event_report_pdf(event)
        
        # def create(self, request, *args, **kwargs):
        #     serializer = self.get_serializer(data=request.data)
        #     serializer.is_valid(raise_exception=True)
            
        #     # Call the create method of the serializer to create the event
        #     # along with its associated entities
        #     self.perform_create(serializer)
            
        #     return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return response


class SchedulePDFDownload(APIView):
    def get(self, request, event_id):
        # You need to fetch the event data
        event = Event.objects.get(pk=event_id)
        response = generate_schedule_pdf(event)
        return response
    






# class UserViewSet(viewsets.ModelViewSet):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
    
class EventUsers(viewsets.ModelViewSet):
    queryset = EventUser.objects.all()
    serializer_class = EventUserSerializer
    
class EventUsersById(APIView):
    def get(self, request, user_id):
        try:
            user = EventUser.objects.get(pk=user_id)
            serializer = EventUserSerializer(user)
            return Response(serializer.data)
        except EventUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email  # Add email to token payload
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    



# class LoginView(APIView):
#     def post(self, request):
#         username = request.data.get('username')
#         password = request.data.get('password')

#         user = authenticate(
#             username=username, password=password)
        
#         refresh = RefreshToken.for_user(user)

#         return JsonResponse(
#             {
#                'refresh':str(refresh),
#                'access':str(refresh.access_token) 
#             }
#         )
    

# class EventUserRegisterView(CreateAPIView):
#     queryset = EventUser.objects.all()
#     serializer_class = EventUserSerializer

    
# class EventUserLoginView(TokenObtainPairView):
#     serializer_class = MyTokenObtainPairSerializer
    

# class EventUserLogoutView(generics.GenericAPIView):
#     def post(self, request):
#         try:
#             refresh_token = request.data["refresh"]
#             token = RefreshToken(refresh_token)
#             token.blacklist()
#             return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import EventUserSerializer, EventUserLoginSerializer
from .models import EventUser


class EventUserRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        serializer = EventUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            serialized_user = EventUserSerializer(user).data  # Serialize the user data
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': serialized_user  # Include serialized user data in the response
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EventUserLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        serializer = EventUserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            user_serializer = EventUserSerializer(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': user_serializer.data 
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AttendeeViewSet(viewsets.ModelViewSet):
    queryset = Attendee.objects.all()
    serializer_class = AttendeeSerializer
    

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('-start_date')
    serializer_class = EventSerializer


class SpeakerViewSet(viewsets.ModelViewSet):
    queryset = Speaker.objects.all()
    serializer_class = SpeakerSerializer


class SponsorViewSet(viewsets.ModelViewSet):
    queryset = Sponsor.objects.all()
    serializer_class = SponsorSerializer
    
    
class RoomIdViewSet(viewsets.ModelViewSet):
    queryset = RoomId.objects.all()
    serializer_class = RoomIdSerializer
    
class uploadsViewset(viewsets.ModelViewSet):
    queryset = Videos.objects.all()
    serializer_class = VideoUploadSerializer
    
    
class EventRegistrationView(APIView):
    def post(self, request):
        serializer = EventSerializer(data=request.data)
        
        if serializer.is_valid():
            event = serializer.save()

            read_serializer = EventSerializer(event)

            return Response(read_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)
           
    def delete(self, request, id):
        try:
            get_event = Event.objects.get(id=id)
            
        except Event.DoesNotExist:
            return Response({'errors': 'user does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        get_event.delete()
            
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    


class AttendeeRegistrationView(APIView):
    def post(self, request):
        serializer = AttendeeRegistrationSerializer(data=request.data)

        if serializer.is_valid():
            # Extract the event ID from the request data
            event_id = request.data.get('event')

            # Check if the event with the given ID exists
            try:
                event = Event.objects.get(pk=event_id)
            except Event.DoesNotExist:
                return Response({"event": "Event with this ID does not exist."}, status=status.HTTP_400_BAD_REQUEST)

            # Check if the event is fully booked
            if event.attendees.count() >= event.available_seat:
                return Response({"event": "This event is fully booked."}, status=status.HTTP_400_BAD_REQUEST)

            # Create the attendee
            attendee = serializer.save()

            # Add the attendee to the event
            event.attendees.add(attendee)

            response_data = {
                "message": "Attendee registered successfully",
                "data": serializer.data
            }

            return Response(response_data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class AttendeeLoginView(APIView):
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        serializer = AttendeeLoginSerializer(data=request.data)

        if serializer.is_valid():
            event_id = serializer.validated_data.get('event_id')
            attendee_email = serializer.validated_data.get('email')

            # Check if the event with the given ID exists
            try:
                event = Event.objects.get(pk=event_id)
            except Event.DoesNotExist:
                return Response({"event": "Event with this ID does not exist."}, status=status.HTTP_400_BAD_REQUEST)

            # Check if the attendee with the given email exists and is registered for the event
            try:
                attendee = Attendee.objects.get(email=attendee_email, events_attending=event)
            except Attendee.DoesNotExist:
                return Response({"attendee": "Attendee is not registered for this event."}, status=status.HTTP_400_BAD_REQUEST)

           
            refresh = RefreshToken.for_user(attendee) 
            return Response({"message": "Attendee logged in successfully", "refresh": str(refresh), "access": str(refresh.access_token)}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SpeakerRegistrationView(APIView):
    def post(self, request):
        serializer = SpeakerRegistrationSerializer(data=request.data)

        if serializer.is_valid():
            # Extract the event ID from the request data
            event_id = request.data.get('event')

            # Check if the event with the given ID exists
            try:
                event = Event.objects.get(pk=event_id)
            except Event.DoesNotExist:
                return Response({"event": "Event with this ID does not exist."}, status=status.HTTP_400_BAD_REQUEST)
            
        
            # Create the speaker
            speaker = serializer.save()

            # Add the speaker to the event
            event.speakers.add(speaker)

            response_data = {
                "message": "speaker registered successfully",
                "data": serializer.data
            }

            return Response(response_data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SponsorRegistrationView(APIView):
    def post(self, request):
        serializer = SponsorRegistrationSerializer(data=request.data)

        if serializer.is_valid():
            # Extract the event ID from the request data
            event_id = request.data.get('event')

            # Check if the event with the given ID exists
            try:
                event = Event.objects.get(pk=event_id)
            except Event.DoesNotExist:
                return Response({"event": "Event with this ID does not exist."}, status=status.HTTP_400_BAD_REQUEST)

            # Create the sponsor
            sponsor = serializer.save()

            # Add the sponsor to the event
            event.sponsors.add(sponsor)

            response_data = {
                "message": "Sponsor registered successfully",
                "data": serializer.data
            }

            return Response(response_data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ScheduleRegistrationView(APIView):
    def post(self, request):
        serializer = ScheduleRegistrationSerializer(data=request.data)

        if serializer.is_valid():
            # Extract the event ID from the request data
            event_id = request.data.get('event')

            # Check if the event with the given ID exists
            try:
                event = Event.objects.get(pk=event_id)
            except Event.DoesNotExist:
                return Response({"event": "Event with this ID does not exist."}, status=status.HTTP_400_BAD_REQUEST)

            # Create the schedule
            schedule = serializer.save()

            # Add the schedule to the event
            event.schedules.add(schedule)

            response_data = {
                "message": "schedule registered successfully",
                "data": serializer.data
            }

            return Response(response_data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class RoomIdRegistrationView(APIView):
    def post(self, request): 
        serializer = RoomIdRegistrationSerializer(data=request.data)
        
        if serializer.is_valid():
            event_id = request.data.get('event')
            
            try:
                event = Event.objects.get(pk=event_id)
            except Event.DoesNotExist:
                return Response({"event": "Event with this ID does not exist."}, status=status.HTTP_400_BAD_REQUEST)
            
            room_id = serializer.validated_data['roomId']
            room_id_instance = RoomId.objects.create(roomId=room_id)
            event.roomids.add(room_id_instance)
            
            response_data = {
                "message": "roomid sent successfully",
                "data": serializer.data
            }
            
            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SendMail(APIView):
    help = 'Send email to attendees if the event has started'

    def get(self, *args, **kwargs):
        now = datetime.now()
        events = Event.objects.filter(start_date__lte=now)

        for event in events:
            
            attendees = event.attendees.all()
            for attendee in attendees:
                self.send_event_start_email(attendee.email, event)
        return HttpResponse({"msg":"sent"})

    def send_event_start_email(self, email, event):
        yag = yagmail.SMTP('abenezerttz23@gmail.com', 'slph vhpk fntf udxz')
        subject = f'Event {event.title} Has Started'
        message = f'The event {event.title} has started. Please join us at {event.location}.'
        yag.send(email, subject, message)
        self.stdout.write(self.style.SUCCESS(f'Email sent to {email} for event {event.title}'))

class VideoUpload(APIView):
    def post(self, request):
        serializer = VideoUploadSerializer(data=request.data)
        
        if (serializer.is_valid()):
            video = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
from django.core.mail import send_mail
from django.http import HttpResponse
from django.views import View

class SendTestEmailView(View):
    def get(self, request, *args, **kwargs):
        subject = 'Test Email'
        message = 'This is a test email sent from Django view.'
        from_email = 'celmonlavi@gmail.com'
        recipient_list = ['abenezerttz23@gmail.com']

        send_mail(subject, message, from_email, recipient_list)
        return HttpResponse('Email sent successfully.')












class PhysicalEventViewSet(viewsets.ModelViewSet):
    queryset = PhysicalEvent.objects.all()
    serializer_class = PhysicalEventSerializer

    def get_serializer_class(self):
        if self.action == 'create':
            return PhysicalEventRegistrationSerializer
        elif self.action in ['update', 'partial_update']:
            return PhysicalEventUpdateSerializer
        return self.serializer_class

    def perform_create(self, serializer):
        serializer.save(banner_image=self.request.data.get('banner_image', None))

    def perform_update(self, serializer):
        serializer.save(banner_image=self.request.data.get('banner_image', None))

    def get_serializer_class(self):
        if self.action == 'create':
            return PhysicalEventRegistrationSerializer
        return self.serializer_class

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({"message": "Event created successfully"}, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({"message": "Event updated successfully"}, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "Event deleted successfully"}, status=status.HTTP_204_NO_CONTENT)




class SponsorshipViewSet(viewsets.ModelViewSet):
    queryset = Sponsorship.objects.all()
    serializer_class = SponsorshipSerializer

    def get_serializer_class(self):
        if self.action == 'create':
            return SponsorshipRegistrationSerializer
        return self.serializer_class

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({"message": "Sponsorship created successfully"}, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({"message": "Sponsorship updated successfully"}, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({"message": "Sponsorship updated successfully"}, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "Sponsorship deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

# views.py



@api_view(['GET'])
def sponsorship_choices(request):
    choices = Sponsorship.SPONSORSHIP_CHOICES
    return Response(choices)

class VenueViewSet(viewsets.ModelViewSet):
    queryset = Venue.objects.all()
    serializer_class = VenueSerializer

    def get_serializer_class(self):
        if self.action == 'create':
            return VenueRegistrationSerializer
        elif self.action in ['update', 'partial_update']:
            return VenueUpdateSerializer
        return self.serializer_class

    def perform_create(self, serializer):
        serializer.save(image=self.request.data.get('image', None))

    def perform_update(self, serializer):
        serializer.save(image=self.request.data.get('image', None))

    def get_serializer_class(self):
        if self.action == 'create':
            return VenueRegistrationSerializer
        return self.serializer_class

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({"message": "Venue created successfully"}, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({"message": "Venue updated successfully"}, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({"message": "Venue updated successfully"}, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "Venue deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

class ContentViewSet(viewsets.ModelViewSet):
    queryset = Content.objects.all()
    serializer_class = ContentSerializer

    def get_serializer_class(self):
        if self.action == 'create':
            return ContentRegistrationSerializer
        return self.serializer_class

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Content created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Content updated successfully"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({"message": "Content deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

class AgendaViewSet(viewsets.ModelViewSet):
    queryset = Agenda.objects.all()
    serializer_class = AgendaSerializer

    def get_serializer_class(self):
        if self.action == 'create':
            return AgendaRegistrationSerializer
        return self.serializer_class

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Agenda item created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Agenda item updated successfully"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({"message": "Agenda item deleted successfully"}, status=status.HTTP_204_NO_CONTENT)








from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.http import JsonResponse, HttpResponse
from django.shortcuts import get_object_or_404
from .models import Reviewer, Abstract, Review
from .serializers import ReviewerSerializer, AbstractSerializer,  ReviewSerializer
import matplotlib.pyplot as plt
import numpy as np
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image


class ReviewerViewSet(viewsets.ModelViewSet):
    queryset = Reviewer.objects.all()
    serializer_class = ReviewerSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Reviewer created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Reviewer updated successfully"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({"message": "Reviewer deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class AbstractViewSet(viewsets.ModelViewSet):
    queryset = Abstract.objects.all()
    serializer_class = AbstractSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Abstract created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Abstract updated successfully"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({"message": "Abstract deleted successfully"}, status=status.HTTP_204_NO_CONTENT)



from rest_framework.decorators import api_view


@api_view(['GET'])
def get_free_reviewers(request):
    free_reviewers = Reviewer.objects.filter(status='free')
    serializer = ReviewerSerializer(free_reviewers, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_submitted_abstracts(request):
    submitted_abstracts = Abstract.objects.filter(status='submitted')
    serializer = AbstractSerializer(submitted_abstracts, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def assign_abstract_to_reviewer(request):
    abstract_id = request.data.get('abstract_id')
    reviewer_id = request.data.get('reviewer_id')
    
    abstract = get_object_or_404(Abstract, id=abstract_id, status='submitted')
    reviewer = get_object_or_404(Reviewer, id=reviewer_id, status='free')

    abstract.reviewer = reviewer
    abstract.status = 'under_review'
    abstract.save()

    reviewer.status = 'busy'
    reviewer.save()

    return Response({'message': 'Abstract assigned successfully'})

@api_view(['GET'])
def get_assigned_abstracts(request):
    assigned_abstracts = Abstract.objects.filter(status__in=['under_review', 'accepted', 'rejected'])
    serializer = AbstractSerializer(assigned_abstracts, many=True)
    return Response(serializer.data)

# class AssignAbstractToReviewerViewSet(viewsets.ViewSet):
#     def assign_abstract_to_reviewer(self, request, abstract_id, reviewer_id):
#         try:
#             # Retrieve the abstract and reviewer objects
#             abstract = Abstract.objects.get(pk=abstract_id)
#             reviewer = Reviewer.objects.get(pk=reviewer_id)

#             # Check if the abstract status is "submitted"
#             if abstract.status != 'submitted':
#                 return Response({"message": "Cannot assign abstract to reviewer. Abstract status is not 'submitted'."}, status=status.HTTP_400_BAD_REQUEST)

#             # Perform the assignment logic here (e.g., update the paper's reviewer field)
#             abstract.reviewer = reviewer
#             abstract.save()

#             # Serialize the abstract with document URLs
#             serializer = AbstractSerializer(abstract)
#             serialized_data = serializer.data

#             # Include document URLs in the response
#             serialized_data['document_url'] = abstract.document.url if abstract.document else None
#             serialized_data['abstract_image_url'] = abstract.abstract_image.url if abstract.abstract_image else None

#             return Response({"message": f"Abstract '{abstract.title}' assigned to reviewer '{reviewer.name}' successfully.", "data": serialized_data}, status=status.HTTP_200_OK)

#         except Abstract.DoesNotExist:
#             return Response({"message": "Abstract does not exist."}, status=status.HTTP_404_NOT_FOUND)
        
#         except Reviewer.DoesNotExist:
#             return Response({"message": "Reviewer does not exist."}, status=status.HTTP_404_NOT_FOUND)
        
#         except Exception as e:
#             return Response({"message": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Review created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Review updated successfully"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({"message": "Review deleted successfully"}, status=status.HTTP_204_NO_CONTENT)




from .models import Exhibitor, ExhibitorBooth, ShowcaseItem
from .serializers import (ExhibitorSerializer, ExhibitorRegistrationSerializer, ExhibitorUpdateSerializer,
                          ExhibitorBoothSerializer, ExhibitorBoothRegistrationSerializer, ExhibitorBoothUpdateSerializer,
                          ShowcaseItemSerializer, ShowcaseItemRegistrationSerializer, ShowcaseItemUpdateSerializer)

class ExhibitorViewSet(viewsets.ModelViewSet):
    queryset = Exhibitor.objects.all()
    serializer_class = ExhibitorSerializer

    def get_serializer_class(self):
        if self.action == 'create':
            return ExhibitorRegistrationSerializer
        elif self.action in ['update', 'partial_update']:
            return ExhibitorUpdateSerializer
        return self.serializer_class

    def perform_create(self, serializer):
        serializer.save(image=self.request.data.get('image', None))

    def perform_update(self, serializer):
        serializer.save(image=self.request.data.get('image', None))

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({"message": "Exhibitor created successfully", "data": serializer.data}, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({"message": "Exhibitor updated successfully", "data": serializer.data})

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "Exhibitor deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

class ExhibitorBoothViewSet(viewsets.ModelViewSet):
    queryset = ExhibitorBooth.objects.all()
    serializer_class = ExhibitorBoothSerializer

    def get_serializer_class(self):
        if self.action == 'create':
            return ExhibitorBoothRegistrationSerializer
        elif self.action in ['update', 'partial_update']:
            return ExhibitorBoothUpdateSerializer
        return self.serializer_class

    def perform_create(self, serializer):
        serializer.save(image=self.request.data.get('image', None))

    def perform_update(self, serializer):
        serializer.save(image=self.request.data.get('image', None))

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({"message": "Exhibitor booth created successfully", "data": serializer.data}, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({"message": "Exhibitor booth updated successfully", "data": serializer.data})

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "Exhibitor booth deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

class ShowcaseItemViewSet(viewsets.ModelViewSet):
    queryset = ShowcaseItem.objects.all()
    serializer_class = ShowcaseItemSerializer

    def get_serializer_class(self):
        if self.action == 'create':
            return ShowcaseItemRegistrationSerializer
        elif self.action in ['update', 'partial_update']:
            return ShowcaseItemUpdateSerializer
        return self.serializer_class

    def perform_create(self, serializer):
        serializer.save(image=self.request.data.get('image', None))

    def perform_update(self, serializer):
        serializer.save(image=self.request.data.get('image', None))

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({"message": "Showcase item created successfully", "data": serializer.data}, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({"message": "Showcase item updated successfully", "data": serializer.data})

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "Showcase item deleted successfully"}, status=status.HTTP_204_NO_CONTENT)



from django.http import HttpResponse
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.units import inch

def generate_report(request):
    # Create the HttpResponse object with the appropriate PDF headers.
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="reviewer_report.pdf"'

    # Create the PDF object, using the response object as its "file."
    p = canvas.Canvas(response, pagesize=A4)
    width, height = A4

    # Set up the title
    p.setFont("Helvetica-Bold", 16)
    p.drawString(100, height - 50, "Reviewer Report")

    # Set up the table headers
    p.setFont("Helvetica-Bold", 10)
    headers = ["#", "Name", "Expertise", "Rating", "Status", "Total Reviews", "Affiliation", "Email"]
    x_offset = 50
    y_offset = height - 100
    table_header_height = 15

    for i, header in enumerate(headers):
        p.drawString(x_offset + (i * 80), y_offset, header)

    # Add table data
    p.setFont("Helvetica", 8)
    reviewers = Reviewer.objects.all()
    y_offset -= table_header_height

    for index, reviewer in enumerate(reviewers):
        p.drawString(x_offset, y_offset, str(index + 1))
        p.drawString(x_offset + 80, y_offset, reviewer.name)
        p.drawString(x_offset + 160, y_offset, reviewer.expertise)
        p.drawString(x_offset + 240, y_offset, str(reviewer.rating))
        p.drawString(x_offset + 320, y_offset, reviewer.status)
        p.drawString(x_offset + 400, y_offset, str(reviewer.total_reviews_completed))
        p.drawString(x_offset + 480, y_offset, reviewer.affiliation)
        p.drawString(x_offset + 560, y_offset, reviewer.email)

        y_offset -= table_header_height

    # Close the PDF object cleanly.
    p.showPage()
    p.save()
    return response




class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer

    # Explicitly define create
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    # Explicitly define retrieve
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    # Explicitly define update
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}
        return Response(serializer.data)

    # Explicitly define partial_update
    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    # Explicitly define destroy
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    # Explicitly define list
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    # Define custom action for additional functionality if needed
    @action(detail=True, methods=['get'])
    def custom_action(self, request, pk=None):
        instance = self.get_object()
        return Response({'custom': 'action', 'data': SessionSerializer(instance).data})







