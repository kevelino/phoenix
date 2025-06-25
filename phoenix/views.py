from django.shortcuts import render
from django.views.generic import TemplateView



class RobotsTxtView(TemplateView):
  template_name = "robots.txt"

def index(request):
  return render(request, "index.html")


def page404(request, exception):
    return render(request, "404.html")