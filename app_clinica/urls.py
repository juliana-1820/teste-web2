from django.urls import path, include
from .views import funcionarios_view, clientes_view,fornecedores_view, index_view, FuncionarioViewSet, ClienteViewSet, FornecedorViewSet
from rest_framework.routers import DefaultRouter

# Roteamento de APIs
router = DefaultRouter()
router.register(r'funcionarios', FuncionarioViewSet)
router.register(r'clientes', ClienteViewSet)
router.register(r'fornecedores', FornecedorViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]



urlpatterns = [
    path('', index_view, name='index'),
    path('index/', index_view, name='index'),
    path('funcionarios/', funcionarios_view, name='funcionarios'),
    path('clientes/', clientes_view, name='clientes'),
    path('api/', include(router.urls)),
]
