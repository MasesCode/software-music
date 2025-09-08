import { useState, useEffect } from 'react';
import { Users, Search, Plus, Edit, Trash2, Shield, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { AppHeader } from '@/components/AppHeader';
import { PageContainer } from '@/components/PageContainer';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/auth';
import { api, ApiError } from '@/lib/api';
import { getErrorMessage } from '@/lib/errorHandler';

interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<{data: User[]}>('/users');
      setUsers(response.data || []);
    } catch (error) {
      toast({
        title: t('error'),
        description: getErrorMessage(error, t),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAdmin = async (userId: number, currentStatus: boolean) => {
    try {
      await api.put(`/users/${userId}`, { is_admin: !currentStatus });
      toast({
        title: t('success'),
        description: currentStatus ? t('userRemovedFromAdmin') : t('userPromotedToAdmin'),
      });
      fetchUsers();
    } catch (error) {
      toast({
        title: t('error'),
        description: getErrorMessage(error, t),
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm(t('confirmDeleteUser'))) return;
    
    try {
      await api.delete(`/users/${userId}`);
      toast({
        title: t('success'),
        description: t('userDeleted'),
      });
      fetchUsers();
    } catch (error) {
      toast({
        title: t('error'),
        description: getErrorMessage(error, t),
        variant: 'destructive',
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase().trim();
    const name = user.name.toLowerCase();
    const email = user.email.toLowerCase();
    return name.includes(query) || email.includes(query);
  });

  if (isLoading) {
    return (
      <ProtectedRoute requiredRole="admin">
        <AppHeader />
        <PageContainer>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">{t('users')}</h1>
            </div>
            <div className="grid gap-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </PageContainer>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <AppHeader />
      <PageContainer>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{t('users')}</h1>
            <Badge variant="secondary" className="text-sm">
              {filteredUsers.length} {filteredUsers.length !== 1 ? t('users') : t('user')}
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t('searchUsers')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t('noUsersFound')}</h3>
                <p className="text-gray-500">
                  {searchQuery ? t('tryAdjustingSearch') : t('noUsersRegistered')}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredUsers.map((userItem) => (
                <Card key={userItem.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                          {userItem.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{userItem.name}</h3>
                          <p className="text-gray-500">{userItem.email}</p>
                          <p className="text-sm text-gray-400">
                            {t('registeredOn')} {new Date(userItem.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {userItem.is_admin && (
                          <Badge variant="default" className="bg-purple-100 text-purple-800">
                            <Shield className="h-3 w-3 mr-1" />
                            {t('admin')}
                          </Badge>
                        )}
                        
                        {userItem.id !== user?.id && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleAdmin(userItem.id, userItem.is_admin)}
                            >
                              {userItem.is_admin ? t('removeAdmin') : t('makeAdmin')}
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteUser(userItem.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
}
