from django.shortcuts import render
from django.http import JsonResponse
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
from django.template.loader import render_to_string
from django.views.generic import TemplateView
import json
from django.conf import settings


def send_contact_email(request, name, email, subject, message):
    subject = f"[Contact] {subject} - {name}"
    
    email_message = render_to_string("emails/email-template.txt", {
      'message': message,
      'email': email,
      'name': name,
    }) 
    
    try:
        # Send message
        send_mail(
            subject=subject,
            message=email_message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email]
        )
        return True
    except Exception:
        return False


class RobotsTxtView(TemplateView):
  template_name = "robots.txt"

def index(request):
  return render(request, "index.html")

def contact(request):
  if request.method == "POST":
    data = json.loads(request.body)
    name = data.get('name')
    email = data.get('email')
    subject = data.get('subject')
    message = data.get('message')
    
    if send_contact_email (request, name, email, subject, message):
      return JsonResponse({'success': True, 'message': 'Message envoyé avec succès.'})
    else:
      return JsonResponse({'success': False, 'message': "Erreur lors de l'envoie du message."})
  return JsonResponse({'success': False, 'message': "Méthode non autorisée"}, status=405)
    
    
    

def page404(request, exception):
    return render(request, "404.html")