from rest_framework import serializers
from .models import Portfolio, Sector, Asset
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class AssetSerializer(serializers.ModelSerializer):
    value = serializers.DecimalField(max_digits=15, decimal_places=2)
    portfolio = serializers.PrimaryKeyRelatedField(queryset=Portfolio.objects.all())
    sector = serializers.PrimaryKeyRelatedField(queryset=Sector.objects.all())

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['value'] = float(representation['value'])  # Convert value to float
        return representation

    class Meta:
        model = Asset
        fields = ['id', 'label', 'value', 'date', 'sector', 'portfolio']

class SectorSerializer(serializers.ModelSerializer):
    assets = AssetSerializer(many=True, required=False)
    portfolio = serializers.PrimaryKeyRelatedField(queryset=Portfolio.objects.all())

    class Meta:
        model = Sector
        fields = ['id', 'label', 'portfolio', 'assets']

    def update(self, instance, validated_data):
        instance.label = validated_data.get('label', instance.label)
        instance.save()
        return instance

class PortfolioSerializer(serializers.ModelSerializer):
    sectors = SectorSerializer(many=True, required=False)
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)

    class Meta:
        model = Portfolio
        fields = ['id', 'label', 'user', 'sectors']

    def create(self, validated_data):
        user = self.context.get('request').user
        portfolio = Portfolio.objects.create(user=user, **validated_data)
        return portfolio
