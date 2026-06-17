'use client';

import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useAuth, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, ArrowLeft, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const auth = useAuth();
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auth) {
      toast({
        variant: "destructive",
        title: "ระบบไม่พร้อมใช้งาน",
        description: "ไม่สามารถเชื่อมต่อกับบริการยืนยันตัวตนได้ โปรดตรวจสอบการตั้งค่า Firebase",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "สมัครไม่สำเร็จ",
        description: "รหัสผ่านไม่ตรงกัน โปรดตรวจสอบอีกครั้ง",
      });
      return;
    }
    
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({
        title: "สมัครสมาชิกสำเร็จ",
        description: "ยินดีต้อนรับสู่ครอบครัว Blue Dragon",
      });
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      let errorMessage = "เกิดข้อผิดพลาดในการสมัครสมาชิก";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "อีเมลนี้ถูกใช้งานแล้ว";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร";
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = "ระบบยังไม่เปิดให้สมัครด้วยอีเมลและรหัสผ่าน (โปรดเปิดใช้งานใน Firebase Console)";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "รูปแบบอีเมลไม่ถูกต้อง";
      }
      
      toast({
        variant: "destructive",
        title: "สมัครไม่สำเร็จ",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sarabun">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center font-bold text-white shadow-xl rotate-3 mx-auto mb-4">
            BD
          </div>
          <h1 className="text-3xl font-bold text-primary">Blue Dragon</h1>
          <p className="text-muted-foreground">ลงทะเบียนเข้าใช้งานระบบ</p>
        </div>

        <Card className="border-none shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">สมัครสมาชิก</CardTitle>
            <CardDescription className="text-center">
              สร้างบัญชีใหม่เพื่อจัดการข้อมูลบริษัทของคุณ
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">อีเมล</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="example@bluedragon.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">รหัสผ่าน</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="อย่างน้อย 6 ตัวอักษร"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">ยืนยันรหัสผ่านอีกครั้ง</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่านเดิม"
                  required 
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full bg-accent h-12 text-lg shadow-lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    กำลังดำเนินการ...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" />
                    ลงทะเบียนสมาชิก
                  </>
                )}
              </Button>
              <Link href="/login" className="w-full">
                <Button variant="ghost" className="w-full text-muted-foreground hover:text-primary">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  กลับไปหน้าเข้าสู่ระบบ
                </Button>
              </Link>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          &copy; 2024 Blue Dragon Construction Co., Ltd.
        </p>
      </div>
    </div>
  );
}
