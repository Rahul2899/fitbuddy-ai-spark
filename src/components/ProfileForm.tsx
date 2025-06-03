import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserProfile, Gender, FitnessGoal, FitnessLevel } from '../types/fitness';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';

const profileSchema = z.object({
  age: z.number().min(13).max(100),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  fitnessGoal: z.enum(['get_active', 'lose_weight', 'build_strength', 'maintain_fitness']),
  limitations: z.string(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  onSubmit: (data: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Partial<UserProfile>;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ onSubmit, initialData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      age: initialData?.age,
      gender: initialData?.gender,
      fitnessLevel: initialData?.fitnessLevel,
      fitnessGoal: initialData?.fitnessGoal,
      limitations: initialData?.limitations?.join(', '),
    },
  });

  const handleFormSubmit = (data: ProfileFormData) => {
    onSubmit({
      ...data,
      limitations: data.limitations.split(',').map(l => l.trim()).filter(Boolean),
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Your Fitness Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              {...register('age', { valueAsNumber: true })}
              placeholder="Enter your age"
            />
            {errors.age && (
              <p className="text-sm text-red-500">{errors.age.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              onValueChange={(value) => setValue('gender', value as Gender)}
              defaultValue={initialData?.gender}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fitnessLevel">Fitness Level</Label>
            <Select
              onValueChange={(value) => setValue('fitnessLevel', value as FitnessLevel)}
              defaultValue={initialData?.fitnessLevel}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select fitness level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fitnessGoal">Fitness Goal</Label>
            <Select
              onValueChange={(value) => setValue('fitnessGoal', value as FitnessGoal)}
              defaultValue={initialData?.fitnessGoal}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select fitness goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="get_active">Get Active</SelectItem>
                <SelectItem value="lose_weight">Lose Weight</SelectItem>
                <SelectItem value="build_strength">Build Strength</SelectItem>
                <SelectItem value="maintain_fitness">Maintain Fitness</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="limitations">
              Movement Limitations or Injuries (comma-separated)
            </Label>
            <Textarea
              id="limitations"
              {...register('limitations')}
              placeholder="e.g., knee pain, limited mobility, back issues"
            />
          </div>

          <Button type="submit" className="w-full">
            Save Profile
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}; 