**contents**
- [용어](#용어)
- [이진트리(Binary Tree)](#이진트리binary-tree)
  - [이진 트리의 표현](#이진-트리의-표현)
  - [이진 트리 순회](#이진-트리-순회)
- [이진탐색트리](#이진탐색트리)
  - [특징](#특징)
- [힙의 종류](#힙의-종류)
  - [최대 힙](#최대-힙)
  - [최소 힙](#최소-힙)
- [삽입](#삽입)
- [삭제](#삭제)

# Tree

트리는 일반적으로 대상 정보의 각 항목들을 계층적으로 연관되도록 구조화시키고자 할 때 사용하는 비선형 자료구조이다.
데이터 요소들의 단순한 나열이 아닌 부모-자식 관계의 계층적 구조로 표현이 된다.
트리는 그래프의 한 종류이며 사이클이 없다.

## 용어

![](https://images.velog.io/images/adam2/post/41b22e4e-c45b-4929-a6ae-c247a56ad91f/image.png)

- **node**: 트리를 구성하고 있는 각 요소
- **Edge(간선)**: 트리를 구성하기 위해 노드와 노드를 연결하는 선
- **Root Node**: 최상위 계층에 존재하는 노드
- **level**: 트리의 특정 깊이를 가지는 노드의 집합
- **degree(차수)**: 하위 트리 개수 / 간선 수 (degree) = 각 노드가 지닌 가지의 수
- **Terminal Node ( = leaf Node, 단말 노드)** : 하위에 다른 노드가 연결되어 있지 않은 노드
- **Internal Node (내부노드, 비단말 노드)** : 단말 노드를 제외한 모든 노드로 루트 노드를 포함한다.

## 이진트리(Binary Tree)

이진트리는 트리를 구성하는 노드들의 최대 차수(degree)가 2인 노드들로 구성되는 트리이다.

- 이진트리의 레벨 i에서 가질 수 있는 최대 노드의 수는 2^i이다. (i>=0)
- 깊이가 k인 이진트리가 가질 수 있는 최대 노드의 수는 2^k-1이다.(k>=1)

이진트리는 `완전 이진 트리(Completable Binary Tree)`와 `포화 이진 트리(Perfect Binary Tree)`, `전 이진 트리(Full Binary Tree)`라고 하는 특별한 트리 구조를 정의할 수 있다.
![](https://images.velog.io/images/adam2/post/762e149f-6231-4df0-a849-cd39892e387d/image.png)
**완전 이진 트리**
![](https://images.velog.io/images/adam2/post/86e22d30-5be1-45e9-ac2b-5fa5403721d1/image.png)

- 트리를 구성하고 있는 임의의 두 단말 노드의 레벨 차이가 1이하이고,
- 마지막 레벨을 제외한 모든 레벨에 존재할 수 있는 모든 노드를 갖고 있으며,
- 왼쪽에서 오른쪽으로 채워지는 이진트리
- `heap`

**전 이진 트리**
![](https://images.velog.io/images/adam2/post/9e3dc01f-51d3-4f48-99c4-3a06b576ef6c/image.png)

- 모든 노드가 0개 또는 2개의 자식 노드를 갖는 트리.

**포화 이진 트리**

- 모든 레벨에 노드가 차있는 상태로 최대 노드 수인 2^k-1개로 채워져 있는 트리
- 전 이진 트리이면서 완전 이진 트리인 경우

### 이진 트리의 표현

1. 배열을 이용한 표현

![](https://images.velog.io/images/adam2/post/e6e1251b-fcc6-4228-8e51-6dc01f577289/image.png)

![](https://images.velog.io/images/adam2/post/04cff6ff-7e08-47f0-b81e-7930960f19a3/image.png)

- 빈 노드에 대해서는 계속 사용하지 않기 때문에 메모리 낭비
- 데이터의 삽입, 삭제 연산시 노드의 레벨 변경으로 인한 데이터의 이동 발생

2. 연결리스트를 이용한 표현

- 각 노드는 data필드와 왼쪽 서브 트리를 가리키는 필드, 오른쪽 서브 트리를 가리키는 필드로 구성

### 이진 트리 순회

![](https://images.velog.io/images/adam2/post/8c6c9235-3bf5-4413-92e5-b771e6d5e734/image.png)

1. 중위 순회(inorder traversal)
   `왼쪽 서브트리 -> 루트 -> 오른쪽 서브트리`
   루트 노드가 가운데에 온다.
   4-2-5-1-3
   .
2. 후위 순회(postorder traversal)
   `왼쪽 서브트리 -> 오른쪽 서브트리 -> 루트`
   루트 노드가 후위에 온다.
   4-5-2-3-1
   .
3. 전위 순회(preorder traversal)
   `루트 -> 왼쪽 -> 오른쪽`
   루트 노드가 맨 앞에 온다.
   1-2-4-5-3

## 이진탐색트리

[바로가기](https://github.com/plm9606/interview_store/blob/master/datastructure/BST.md)

# Heap

힙(heap)은 **완전이진트리(Complete binary tree)** 를 기본으로 한 자료구조(tree-based structure) (시간복잡도 : O(log N))

### 특징

- 일반적으로 배열을 사용하여 구현한다.배열에 트리의 값들을 넣어줄 때, 0 번째는 건너뛰고 1 번 index 부터 루트노드가 시작된다.
- 여러 개의 값들 중에서 최댓값이나 최솟값을 빠르게 찾아내도록 만들어진 자료구조이다. (우선순위큐 구현시 사용함)
- 힙은 일종의 반정렬 상태(느슨한 정렬 상태) 를 유지한다.
  - 큰 값이 상위 레벨에 있고 작은 값이 하위 레벨에 있다는 정도
  - 간단히 말하면 부모 노드의 키 값이 자식 노드의 키 값보다 항상 큰(작은) 이진 트리를 말한다.
- 힙 트리에서는 중복된 값을 허용한다. (이진 탐색 트리에서는 중복된 값을 허용하지 않는다.)

## 힙의 종류

### 최대 힙

부모노드의 키값이 자식노드의 키값보다 항상 큰 힙
Max Heap에서는 Root node 에 있는 값이 제일 크므로, 최대값을 찾는데 소요되는 연산의 time complexity 이 O(1)이다. 그리고 complete binary tree이기 때문에 배열을 사용하여 효율적으로 관리할 수 있다. (즉, random access 가 가능하다. Min heap 에서는 최소값을 찾는데 소요되는 연산의 time complexity 가 O(1)이다.)

### 최소 힙

부모노드의 키값이 자식노드의 키값보다 항상 작은 힙
키값의 대소관계는 부모-자식 간에만 성립하고 형제간에는 성립하지 않는다.

## 삽입

(max heap 기준)

1. 힙의 가장 마지막 원소에 원하는 값을 삽입한다.
2. 부모가 삽입 원소보다 작다면(Max_Heap기준) 부모와 자식의 값을 교환한다.
3. 2번에서 부모가 없거나, 부모가 자식보다 클 경우에 종료
   ![](https://images.velog.io/images/adam2/post/623dd9fb-a1b4-4477-bdaa-0f23627e140d/image.png)

## 삭제

(max heap 기준)

1. 루트노드를 삭제하고 힙의 마지막 노드를 루트로 가져온다.
2. 가져온 루트와 자식노드를 비교하고 가져온 노드가 작을 경우 자식과 위치 변경
3. 자식 노드가 더이상 없거나, 자식보다 클 경우 종료
   ![](https://images.velog.io/images/adam2/post/c9a9ff62-0d59-4606-8558-de6a530d1274/image.png)

---

참고
https://gmlwjd9405.github.io/2018/08/12/data-structure-tree.html
https://wayhome25.github.io/cs/2017/04/19/cs-23/
https://coderkoo.tistory.com/10
https://zeddios.tistory.com/237
https://nesoy.github.io/articles/2018-08/Algorithm-RedblackTree

