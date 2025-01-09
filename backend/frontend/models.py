from django.db import models
from django.contrib.auth.models import User

class Portfolio(models.Model):
	label = models.CharField(max_length=255)
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='portfolios')

	def __str__(self):
		return f"{self.label} - {self.user}"

class Sector(models.Model):
	portfolio = models.ForeignKey(Portfolio, related_name='sectors', on_delete=models.CASCADE)
	label = models.CharField(max_length=255)

	def __str__(self):
		return self.label

class Asset(models.Model):
	sector = models.ForeignKey(Sector, related_name='assets', on_delete=models.CASCADE)
	portfolio = models.ForeignKey(Portfolio, related_name='assets', on_delete=models.CASCADE)
	label = models.CharField(max_length=255)
	value = models.DecimalField(max_digits=15, decimal_places=2)
	date = models.DateField()

	def __str__(self):
		return f"{self.label} - {self.value}"


