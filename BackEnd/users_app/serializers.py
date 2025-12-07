from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenJwtSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token= super().get_token(user)

        token['role'].user.role
        token['username'].user.username
        return token
    

    def validate(self, attrs):
        data= super().validate(attrs)  

        data['id']=self.user.id
        data['username']=self.user.username
        data['email'] = self.user.email
        data['role'] = self.user.role
        data['mobile'] = self.user.mobile
        data['age'] = self.user.age
        data['status'] = self.user.status

        return data