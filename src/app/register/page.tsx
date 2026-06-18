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
import { UserPlus, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function RegisterPage() {
  const auth = useAuth();
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    
    if (!auth) {
      setErrorMsg("ระบบ Firebase ยังไม่พร้อมใช้งาน");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("รหัสผ่านไม่ตรงกัน");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }
    
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({
        title: "สำเร็จ",
        description: "ลงทะเบียนสมาชิกใหม่เรียบร้อยแล้ว",
      });
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      let message = "เกิดข้อผิดพลาดในการลงทะเบียน";
      
      if (error.code === 'auth/email-already-in-use') {
        message = "อีเมลนี้มีอยู่ในระบบแล้ว";
      } else if (error.code === 'auth/invalid-email') {
        message = "รูปแบบอีเมลไม่ถูกต้อง";
      } else if (error.code === 'auth/operation-not-allowed') {
        message = "ระบบยังไม่เปิดให้สมัครด้วยอีเมล (โปรดเปิดใช้งาน Email/Password ใน Firebase Console)";
      } else if (error.code === 'auth/api-key-not-valid') {
        message = "API Key ของ Firebase ไม่ถูกต้อง โปรดตรวจสอบการตั้งค่า";
      }
      
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="w-10 h-10 animate-spin text-accent" />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sarabun">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center font-bold text-white shadow-xl rotate-3 mx-auto mb-4 text-2xl">BD</div>
          <h1 className="text-3xl font-bold text-primary">Blue Dragon</h1>
          <p className="text-muted-foreground">สร้างบัญชีผู้ใช้งานใหม่</p>
        </div>

        <Card className="border-none shadow-2xl">
          <CardHeader className="bg-white border-b">
            <CardTitle className="text-xl text-center">ลงทะเบียน</CardTitle>
            <CardDescription className="text-center">กรอกข้อมูลเพื่อเริ่มต้นใช้งานระบบ</CardDescription>
          </CardHeader>
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4 pt-6">
              {errorMsg && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>พบข้อผิดพลาด</AlertTitle>
                  <AlertDescription>{errorMsg}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">อีเมล</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">รหัสผ่าน</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">ยืนยันรหัสผ่านอีกครั้ง</Label>
                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full bg-accent h-12 shadow-lg" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <UserPlus className="w-5 h-5 mr-2" />}
                ยืนยันลงทะเบียน
              </Button>
              <Link href="/login" className="w-full text-center">
                <Button variant="ghost" className="text-muted-foreground">
                  <ArrowLeft className="w-4 h-4 mr-2" /> ย้อนกลับไปหน้าล็อกอิน
                </Button>
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
