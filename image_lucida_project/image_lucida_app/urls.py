from django.conf.urls import url, include
from django.contrib import admin
from image_lucida_app.views import * 



app_name = 'image_lucida_app'
urlpatterns = [
    url(r'^$', index_view.index, name='index'),
    url(r'^customer', customer_view.CustomerView.as_view(), name='CustomerView'),
    url(r'^order/', createorder_view.display_order_and_products, name='order'),
    url(r'^productTypes/', product_types_view.productTypes, name="productTypesView"),
    url(r'^add_product_type/', product_types_view.add_product_type, name="add_product_type"),
    url(r'^(?P<productTypes_id>\d+)/all-products/$', all_products_view.all_products, name="allProductsView"),
    url(r'^customer', customer_view.CustomerView.as_view(), name='CustomerView'),
    url(r'^(?P<product_id>[0-9]+)/product/$', product_details_view.detail, name='product_detail'),
    url(r'^payment', paymenttype_view.get_payment_types, name='PaymentTypeView'),
    url(r'^add_payment_type', paymenttype_view.add_payment_type, name='add_payment_type'),
    url(r'^add_product_to_order', addproducttoorder_view.add_product_to_order, name='add_product_to_order'),
    url(r'^remove_product_from_order', removeproductfromorder_view.remove_product_from_order, name='remove_product_from_order'),
    url(r'^register/', customer_view.RegisterView.as_view(), name='register'),
    url(r'^register_customer/', customer_view.register_customer, name='register_customer'),
    url(r'^login/', customer_view.LoginView.as_view(), name='login'),
    url(r'^logout/', customer_view.logout_customer, name= 'logout'),
    url(r'^login_customer/', customer_view.login_customer, name='login_customer'),
    url(r'^checkout', checkout_view.checkout, name='checkout'),
    url(r'^confirm_order', checkout_view.confirm_order, name='confirm_order'),
    url(r'^add/', add_product_to_list_view.renderProduct, name='add'),
    url(r'^addProduct/', add_product_to_list_view.addProduct, name='addProduct'),

]