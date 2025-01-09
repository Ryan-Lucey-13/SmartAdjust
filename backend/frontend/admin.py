from django.contrib import admin
from .models import Portfolio, Sector, Asset

class PortfolioAdmin(admin.ModelAdmin):
	list_display = ('label', 'user')
	search_fields = ('label',)
	list_filter = ('user',)

class SectorAdmin(admin.ModelAdmin):
	list_display = ('label', 'portfolio')
	search_fields = ('label',)
	list_filter = ('portfolio',)

class AssetAdmin(admin.ModelAdmin):
	list_display = ('label', 'sector')
	search_fields = ('label',)
	list_filter = ('sector',)

admin.site.register(Portfolio, PortfolioAdmin)
admin.site.register(Sector, SectorAdmin)
admin.site.register(Asset, AssetAdmin)