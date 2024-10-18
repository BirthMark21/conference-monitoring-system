from django.urls import path, include
from rest_framework.routers import DefaultRouter

from django.conf.urls.static import static
# from rest_framework_simplejwt.views import (
#     TokenObtainPairView,
#     TokenRefreshView,
# )

from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenObtainPairView
)

from Backend import settings


from . import views

router = DefaultRouter()
router.register(r'api/attendees', views.AttendeeViewSet)
router.register(r'api/events', views.EventViewSet)
router.register(r'api/speakers', views.SpeakerViewSet)
router.register(r'api/sponsors', views.SponsorViewSet)
# router.register(r'api/users', views.UserViewSet)
router.register(r'api/eventusers', views.EventUsers)
router.register(r'api/roomid', views.RoomIdViewSet)
router.register(r'api/videos', views.uploadsViewset)
router.register(r'api/physical-events', views.PhysicalEventViewSet, basename='physical-event')
router.register(r'api/sponsorships', views.SponsorshipViewSet, basename='sponsorship')
router.register(r'api/venues', views.VenueViewSet, basename='venue')
router.register(r'api/content', views.ContentViewSet, basename='content')
router.register(r'api/agenda', views.AgendaViewSet, basename='agenda')
#new 
router.register(r'api/reviewers', views.ReviewerViewSet, basename='reviewer')
router.register(r'api/abstracts', views.AbstractViewSet, basename='abstract')
router.register(r'api/reviews', views.ReviewViewSet, basename='review')

router.register(r'api/exhibitors', views.ExhibitorViewSet, basename='exhibitor')
router.register(r'api/exhibitor-booths', views.ExhibitorBoothViewSet, basename='exhibitor-booth')
router.register(r'api/showcase-items', views.ShowcaseItemViewSet, basename='showcase-item')
# router.register(r'api/users', views.UserViewSet)
router.register(r'api/sessions', views.SessionViewSet, basename='session_break')

urlpatterns = [
    path('', include(router.urls)),
#     from misganaw
     path('api/sponsorship_choices/', views.sponsorship_choices, name='sponsorship-choices'),
#     path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('generate_report/', views.generate_report, name='generate_report'),
    path('api/free_reviewers/', views.get_free_reviewers, name='free_reviewers'),
    path('api/submitted_abstracts/', views.get_submitted_abstracts, name='submitted_abstracts'),
    path('api/assign_abstract/', views.assign_abstract_to_reviewer, name='assign_abstract'),
    path('api/assigned_abstracts/', views.get_assigned_abstracts, name='get_assigned_abstracts'),  # New endpoint
#     
    
    path('api/token/', views.MyTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    
    path('api/register/', views.EventUserRegisterView.as_view(), name='user-register'),
    path('api/login/', views.EventUserLoginView.as_view(), name='user-login'),
#     path('api/login/', views.LoginView.as_view(), name='user-login'),
    path('api/users/<int:user_id>/', views.EventUsersById.as_view(), name='get_user_by_id'),
    
    
#     path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('api/event/register/', views.EventRegistrationView.as_view(), 
         name='event-registration'),
    
    path('api/attendee/register/', views.AttendeeRegistrationView.as_view(),
         name='attendee-registration'),
    
    path('api/attendee/login',  views.AttendeeLoginView.as_view(), name='attendee-login'),
    
    path('api/speaker/register/', views.SpeakerRegistrationView.as_view(),
         name='speaker-registration'),

    path('api/sponsor/register/', views.SponsorRegistrationView.as_view(),
         name='sponsor-registration'),

    path('api/schedule/register/', views.ScheduleRegistrationView.as_view(),
         name='schedule-registration'),
    
    path('api/roomId/register/', views.RoomIdRegistrationView.as_view(),
         name='roomid-registration'),
    
    path('api/send_mails/', views.SendMail.as_view(),
         name='mail'),
    
    path('api/send_test_email/', views.SendTestEmailView.as_view(),
         name='test_mail'),
    
    
    
    path('api/videos/upload', views.VideoUpload.as_view(), name='upload_videos'),
    

#     path('api/users/<int:pk>/',
#          views.UserViewSet.as_view({'get': 'retrieve'}), name='user-detail'),


    path('api/download-attendees-pdf/<int:event_id>/',
         views.AttendeesPDFDownload.as_view(), name='download-attendees-pdf'),
    
    path('api/download-event-report-pdf/<int:event_id>/',
         
         views.EventReportPDFDownload.as_view(), name='download-event-report-pdf'),
    path('api/download-event-schedule-pdf/<int:event_id>/',
         
         views.SchedulePDFDownload.as_view(), name='download-event-schedule-pdf'),
 ]
# + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
