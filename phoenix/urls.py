from django.contrib import admin
from django.conf.urls.static import static
from django.urls import path, re_path
from django.views.static import serve
from django.conf import settings

from . import views as site_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', site_views.index, name='index'),
    re_path(r"^static/(?P<path>.*)$", serve, {'document_root':settings.STATIC_ROOT}),
    re_path(r"^media/(?P<path>.*)$", serve, {'document_root':settings.MEDIA_ROOT}),
]

handler404 = 'phoenix.views.page404'

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)