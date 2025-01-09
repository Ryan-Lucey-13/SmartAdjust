from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views
from rest_framework.routers import DefaultRouter
from frontend.views import PortfolioListView, SectorViewSet, AssetViewSet, UserViewSet, login_view, register_user, logout_view

router = DefaultRouter()
router.register(r'portfolios', PortfolioListView)
router.register(r'sectors', SectorViewSet)
router.register(r'assets', AssetViewSet)
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', auth_views.LoginView.as_view(), name='login'),
    path('register/', register_user, name='register'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('api/logout/', logout_view, name='logout-api'),
    path('api/login/', login_view, name='login-api'),
    path('api/', include(router.urls)),
]
