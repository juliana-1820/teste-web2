from django.db import models

# Create your models here.

class Funcionario(models.Model):
    nome = models.CharField(max_length=255)
    cpf = models.CharField(max_length=14, unique=True, default="000.000.000-00")
    telefone = models.CharField(max_length=15, null=True, blank=True)   
    endereco = models.CharField(max_length=500, null=True, blank=True) 
    cargo = models.CharField(max_length=255)

    def __str__(self):
        return self.nome


class Cliente(models.Model):
    nome = models.CharField(max_length=100)
    cpf = models.CharField(max_length=14, unique=True, default="000.000.000-00")
    endereco = models.CharField(max_length=255)
    telefone = models.CharField(max_length=15)
    contato_emergencia = models.CharField(max_length=15)

    def __str__(self):
        return self.nome


class Fornecedor(models.Model):
    nome = models.CharField(max_length=255)
    telefone = models.CharField(max_length=20)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.nome
